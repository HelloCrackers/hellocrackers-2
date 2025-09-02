import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-festive text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-white/90">Please read our terms and conditions carefully</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">1. General Terms</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to Hello Crackers. These terms and conditions outline the rules and regulations 
                for the use of our website and services. By accessing this website, we assume you accept 
                these terms and conditions.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">2. Minimum Order Policy</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Minimum order value is ₹3,000 for all purchases</li>
                <li>Free delivery is provided across Tamil Nadu for orders above minimum value</li>
                <li>Orders below minimum value will not be processed</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">3. Delivery Policy</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Delivery is available across Tamil Nadu</li>
                <li>Delivery date can be selected from today + 3 days onward</li>
                <li>We ensure safe and timely delivery of all orders</li>
                <li>Customer must be available at the delivery address during delivery window</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">4. Cancellation & Refund Policy</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="font-bold text-yellow-800">Important: Cancellation Charges Apply</p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Cancellation charges: 70% of order value</strong></li>
                <li>Cancellations must be requested at least 24 hours before delivery date</li>
                <li>Refund amount (30% of order value) will be processed within 7-10 business days</li>
                <li>No cancellations accepted on delivery day or after product dispatch</li>
                <li>Festival season orders (Diwali period) have stricter cancellation policies</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">5. Product Quality & Safety</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All products are Supreme Court compliant</li>
                <li>We ensure highest quality standards in manufacturing</li>
                <li>Products are tested for safety and performance</li>
                <li>Use products only as per instructions provided</li>
                <li>Adult supervision required for children using crackers</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">6. Payment Terms</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Payment must be completed before order processing</li>
                <li>We accept online payments through secure gateways</li>
                <li>Quotation will be generated after payment confirmation</li>
                <li>Remittance challan will be provided for completed payments</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">7. Liability & Responsibility</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Customer is responsible for safe handling and use of crackers</li>
                <li>We are not liable for injuries caused by misuse of products</li>
                <li>Follow all local laws and regulations regarding firecracker usage</li>
                <li>Use products in open areas with proper safety measures</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">8. Contact Information</h2>
              <div className="bg-brand-orange/10 rounded-lg p-4">
                <p className="font-semibold mb-2">For any queries regarding terms and conditions:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Phone: +91 98765 43210</li>
                  <li>Email: info@hellocrackers.com</li>
                  <li>Address: Factory Outlet, Sivakasi, Tamil Nadu - 626123</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-red">9. Updates to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to update these terms and conditions at any time. 
                Changes will be effective immediately upon posting on our website. 
                Continued use of our services constitutes acceptance of updated terms.
              </p>
            </section>

            <div className="bg-brand-red/10 rounded-lg p-6 mt-8">
              <p className="text-center font-semibold">
                By placing an order with Hello Crackers, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms & Conditions.
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}