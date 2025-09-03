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

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ProcessResult {
  success: boolean;
  data?: ProductData[];
  errors: ValidationError[];
  processedCount: number;
  errorCount: number;
}

export interface ProcessedFile {
  file: File;
  processedBlob?: Blob;
  error?: string;
}

export interface MediaProcessResult {
  success: boolean;
  processedFiles: ProcessedFile[];
  errors: ValidationError[];
  mappedCount: number;
  unmappedCount: number;
}

// Process ZIP file containing images/videos with product code mapping
export const processZipFile = async (
  zipFile: File, 
  existingProductCodes: string[] = [],
  removeBackgrounds = false
): Promise<MediaProcessResult> => {
  try {
    const zip = await JSZip.loadAsync(zipFile);
    const processedFiles: ProcessedFile[] = [];
    const errors: ValidationError[] = [];
    let mappedCount = 0;
    let unmappedCount = 0;

    for (const [filename, file] of Object.entries(zip.files)) {
      if (file.dir) continue; // Skip directories
      
      const blob = await file.async('blob');
      const fileObj = new File([blob], filename, { type: blob.type });
      
      // Extract product code from folder structure
      const pathParts = filename.split('/');
      const productCode = pathParts[0]; // First part should be product code
      
      // Validate if product code exists in database
      if (existingProductCodes.length > 0 && !existingProductCodes.includes(productCode)) {
        errors.push({
          row: 0,
          field: 'Product Code',
          message: `Folder "${productCode}" does not match any existing Product Code in database`,
          value: productCode
        });
        unmappedCount++;
      } else {
        mappedCount++;
      }
      
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

    return {
      success: errors.length === 0,
      processedFiles,
      errors,
      mappedCount,
      unmappedCount
    };
  } catch (error) {
    return {
      success: false,
      processedFiles: [],
      errors: [{ row: 0, field: 'File', message: `Failed to process ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}` }],
      mappedCount: 0,
      unmappedCount: 0
    };
  }
};

// Process Excel file for product data with enhanced validation
export const processExcelFile = (excelFile: File): Promise<ProcessResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const products: ProductData[] = [];
        const errors: ValidationError[] = [];
        let processedCount = 0;
        
        // Expected headers for validation
        const expectedHeaders = ['Product Code', 'Product Name', 'Category', 'User For', 'Price (₹)', 'Discount %', 'Final Rate (₹)', 'Quantity'];
        
        // Skip header row and process data
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          const rowNumber = i + 1;
          
          // Skip empty rows
          if (!row || row.every(cell => !cell)) continue;
          
          const rowErrors: ValidationError[] = [];
          
          // Validate mandatory fields
          const productCode = String(row[0] || '').trim();
          const productName = String(row[1] || '').trim();
          const category = String(row[2] || '').trim();
          const userFor = String(row[3] || '').trim();
          const price = row[4];
          const discount = row[5];
          const finalRate = row[6];
          const quantity = row[7];
          
          // Mandatory field validations
          if (!productCode) {
            rowErrors.push({ row: rowNumber, field: 'Product Code', message: 'Missing Product Code', value: productCode });
          } else if (!/^[a-zA-Z0-9-_]+$/.test(productCode)) {
            rowErrors.push({ row: rowNumber, field: 'Product Code', message: 'Invalid Product Code format (use only letters, numbers, hyphens, underscores)', value: productCode });
          }
          
          if (!productName) {
            rowErrors.push({ row: rowNumber, field: 'Product Name', message: 'Missing Product Name', value: productName });
          }
          
          if (!category) {
            rowErrors.push({ row: rowNumber, field: 'Category', message: 'Missing Category', value: category });
          }
          
          if (!userFor || !['Family', 'Adult', 'Kids'].includes(userFor)) {
            rowErrors.push({ row: rowNumber, field: 'User For', message: 'Invalid User For (must be Family, Adult, or Kids)', value: userFor });
          }
          
          // Price validations
          const numPrice = Number(price);
          if (isNaN(numPrice) || numPrice <= 0) {
            rowErrors.push({ row: rowNumber, field: 'Price (₹)', message: 'Invalid Price Format (must be a positive number)', value: price });
          }
          
          // Discount validations
          const numDiscount = Number(discount);
          if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
            rowErrors.push({ row: rowNumber, field: 'Discount %', message: 'Invalid Discount Format (must be 0-100)', value: discount });
          }
          
          // Final Rate validations
          const numFinalRate = Number(finalRate);
          if (isNaN(numFinalRate) || numFinalRate < 0) {
            rowErrors.push({ row: rowNumber, field: 'Final Rate (₹)', message: 'Invalid Final Rate Format (must be a positive number)', value: finalRate });
          }
          
          // Quantity validations
          const numQuantity = Number(quantity);
          if (isNaN(numQuantity) || numQuantity < 0 || !Number.isInteger(numQuantity)) {
            rowErrors.push({ row: rowNumber, field: 'Quantity', message: 'Invalid Quantity Format (must be a positive integer)', value: quantity });
          }
          
          // Check Final Rate calculation
          if (!isNaN(numPrice) && !isNaN(numDiscount) && !isNaN(numFinalRate)) {
            const expectedFinalRate = numPrice - (numPrice * numDiscount / 100);
            if (Math.abs(numFinalRate - expectedFinalRate) > 0.01) {
              rowErrors.push({ 
                row: rowNumber, 
                field: 'Final Rate (₹)', 
                message: `Final Rate mismatch. Expected: ₹${expectedFinalRate.toFixed(2)} (Price - (Price × Discount %))`, 
                value: finalRate 
              });
            }
          }
          
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            // Only add valid products
            const product: ProductData = {
              productCode,
              productName,
              category,
              userFor: userFor as 'Family' | 'Adult' | 'Kids',
              mrp: numPrice,
              discount: numDiscount,
              finalRate: numFinalRate,
              stock: numQuantity,
              description: String(row[8] || '').trim(),
              content: String(row[9] || '').trim()
            };
            products.push(product);
            processedCount++;
          }
        }
        
        resolve({
          success: errors.length === 0,
          data: products,
          errors,
          processedCount,
          errorCount: errors.length
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [{ row: 0, field: 'File', message: `Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          processedCount: 0,
          errorCount: 1
        });
      }
    };
    
    reader.onerror = () => resolve({
      success: false,
      data: [],
      errors: [{ row: 0, field: 'File', message: 'Failed to read Excel file' }],
      processedCount: 0,
      errorCount: 1
    });
    
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

// Generate error log as downloadable text file
export const generateErrorLog = (errors: ValidationError[], filename: string = 'upload_errors') => {
  const timestamp = new Date().toLocaleString();
  let logContent = `Product Upload Error Log\n`;
  logContent += `Generated: ${timestamp}\n`;
  logContent += `Total Errors: ${errors.length}\n\n`;
  logContent += `${'='.repeat(50)}\n\n`;
  
  errors.forEach((error, index) => {
    logContent += `Error ${index + 1}:\n`;
    logContent += `Row: ${error.row}\n`;
    logContent += `Field: ${error.field}\n`;
    logContent += `Message: ${error.message}\n`;
    if (error.value !== undefined) {
      logContent += `Value: "${error.value}"\n`;
    }
    logContent += `\n${'-'.repeat(30)}\n\n`;
  });
  
  logContent += `Guidelines for fixing errors:\n`;
  logContent += `1. Ensure all mandatory columns are filled\n`;
  logContent += `2. Product Code should only contain letters, numbers, hyphens, and underscores\n`;
  logContent += `3. Price and Final Rate must be positive numbers\n`;
  logContent += `4. Discount must be between 0-100\n`;
  logContent += `5. Quantity must be a positive integer\n`;
  logContent += `6. Final Rate = Price - (Price × Discount %)\n`;
  logContent += `7. User For must be one of: Family, Adult, Kids\n`;
  
  const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
};

// Generate sample Excel template
export const generateProductTemplate = () => {
  const template = [
    {
      'Product Code': 'H001',
      'Product Name': 'Sample Cracker',
      'Category': 'Fancy Crackers',
      'User For': 'Family',
      'Price (₹)': 500,
      'Discount %': 10,
      'Final Rate (₹)': 450,
      'Quantity': 100,
      'Description': 'Sample description',
      'Content': 'Pack of 5'
    },
    {
      'Product Code': 'H002',
      'Product Name': 'Family Sparklers',
      'Category': 'Sparklers',
      'User For': 'Family',
      'Price (₹)': 200,
      'Discount %': 15,
      'Final Rate (₹)': 170,
      'Quantity': 250,
      'Description': 'Safe sparklers for family celebrations',
      'Content': 'Pack of 10'
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