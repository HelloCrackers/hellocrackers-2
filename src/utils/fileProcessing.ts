import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { removeBackground, loadImage } from './backgroundRemoval';

export interface ProductData {
  productCode: string;
  productName: string;
  category: string;
  userFor: 'Family' | 'Adult' | 'Kids';
  mrp: number;
  discount: number;
  finalRate: number;
  stock: number;
  description?: string;
  content?: string;
}

export interface ProcessedFile {
  file: File;
  processedBlob?: Blob;
  error?: string;
}

// Process ZIP file containing images/videos
export const processZipFile = async (
  zipFile: File, 
  removeBackgrounds = false
): Promise<ProcessedFile[]> => {
  try {
    const zip = await JSZip.loadAsync(zipFile);
    const processedFiles: ProcessedFile[] = [];

    for (const [filename, file] of Object.entries(zip.files)) {
      if (file.dir) continue; // Skip directories
      
      const blob = await file.async('blob');
      const fileObj = new File([blob], filename, { type: blob.type });
      
      let processedBlob: Blob | undefined;
      let error: string | undefined;

      try {
        // Only process images for background removal
        if (removeBackgrounds && blob.type.startsWith('image/')) {
          const img = await loadImage(blob);
          processedBlob = await removeBackground(img);
        }
      } catch (err) {
        error = `Failed to process ${filename}: ${err instanceof Error ? err.message : 'Unknown error'}`;
      }

      processedFiles.push({
        file: fileObj,
        processedBlob,
        error
      });
    }

    return processedFiles;
  } catch (error) {
    throw new Error(`Failed to process ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Process Excel file for product data
export const processExcelFile = (excelFile: File): Promise<ProductData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and process data
        const products: ProductData[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length < 8) continue; // Ensure minimum required columns
          
          const product: ProductData = {
            productCode: String(row[0] || '').trim(),
            productName: String(row[1] || '').trim(),
            category: String(row[2] || '').trim(),
            userFor: (row[3] as 'Family' | 'Adult' | 'Kids') || 'Family',
            mrp: Number(row[4]) || 0,
            discount: Number(row[5]) || 0,
            finalRate: Number(row[6]) || 0,
            stock: Number(row[7]) || 0,
            description: String(row[8] || '').trim(),
            content: String(row[9] || '').trim()
          };
          
          if (product.productCode && product.productName) {
            products.push(product);
          }
        }
        
        resolve(products);
      } catch (error) {
        reject(new Error(`Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read Excel file'));
    reader.readAsArrayBuffer(excelFile);
  });
};

// Export data to Excel
export const exportToExcel = (data: any[], filename: string, sheetName = 'Sheet1') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    throw new Error(`Failed to export to Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Generate sample Excel template
export const generateProductTemplate = () => {
  const template = [
    {
      'Product Code': 'H001',
      'Product Name': 'Sample Cracker',
      'Category': 'Fancy Crackers',
      'User For': 'Family',
      'MRP': 500,
      'Discount %': 90,
      'Final Rate': 50,
      'Stock': 1000,
      'Description': 'Sample description',
      'Content': 'Pack of 5'
    }
  ];
  
  exportToExcel(template, 'product_upload_template', 'Products');
};

// Validate uploaded images
export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

// Validate uploaded videos
export const validateVideoFile = (file: File): boolean => {
  const validTypes = ['video/mp4', 'video/webm', 'video/mov'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};