import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Scale, FileText, Phone, MessageCircle } from "lucide-react";

const SupremeCourtNotice = () => {
  return (
    <Card className="p-6 border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Scale className="h-8 w-8 text-red-600" />
          </div>
          <Badge className="bg-red-600 text-white mb-3 text-lg px-4 py-2">
            Supreme Court Notice
          </Badge>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Important Legal Information</h2>
        </div>

        {/* Main Notice */}
        <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Supreme Court Order 2018</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>As per 2018 Supreme Court order, online sale of firecrackers are not permitted!</strong>
              </p>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              We value our customers and at the same time, respect jurisdiction. We request you to add your products 
              to the cart and submit the required crackers through the enquiry button.
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">Our Process:</h4>
              <ul className="space-y-2 text-green-700">
                <li>• Add products to cart and submit enquiry</li>
                <li>• We will contact you within 24 hours</li>
                <li>• Order confirmation through WhatsApp or phone call</li>
                <li>• Legal delivery through registered transport</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Compliance & Safety
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Our License No:</strong> [License Number Here]
            </p>
            <p>
              Hello Crackers as a company follows <strong>100% legal & statutory compliances</strong> and all our shops, 
              go-downs are maintained as per the explosive acts.
            </p>
            <p>
              We send the parcels through <strong>registered and legal transport service providers</strong> as like 
              every other major companies in Sivakasi is doing so.
            </p>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp Enquiry
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Phone className="h-4 w-4 mr-2" />
            Call for Order: +91 9042132123
          </Button>
        </div>

        {/* Additional Notice */}
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Please add and submit your enquiries and enjoy your Diwali with Hello Crackers.</strong>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SupremeCourtNotice;