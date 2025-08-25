import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
                             By accessing and using Hairmama ("the Application"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              These Terms of Service ("Terms") govern your use of our hair care application and services. 
              Please read these Terms carefully before using our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
                             Hairmama is a comprehensive hair care application that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Hair assessment and analysis tools</li>
              <li>Ingredient safety checking and recommendations</li>
              <li>Progress tracking and photo comparison</li>
              <li>Personalized hair care routines and goals</li>
              <li>Nutritional guidance for hair health</li>
              <li>Educational content about hair care</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Creation</h3>
              <p>
                To access certain features, you must create an account. You agree to provide accurate, 
                current, and complete information during registration and to update such information 
                to keep it accurate, current, and complete.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Security</h3>
              <p>
                You are responsible for safeguarding your account credentials and for all activities 
                that occur under your account. You agree to notify us immediately of any unauthorized 
                use of your account.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Upload or transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use automated systems to access the service</li>
              <li>Share your account credentials with others</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">User Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Content Ownership</h3>
              <p>
                You retain ownership of any content you upload, including photos and personal information. 
                By uploading content, you grant us a limited license to use, store, and display that content 
                in connection with providing our services.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Content Guidelines</h3>
              <p>
                You are responsible for ensuring that any content you upload is appropriate, 
                does not violate any laws, and does not infringe on the rights of others.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">Important Medical Notice</p>
              <p className="text-yellow-700">
                                 Hairmama is not a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified health provider with any questions 
                you may have regarding a medical condition.
              </p>
            </div>
            <p>
              The information provided through our application is for educational and informational purposes only. 
              We do not guarantee the accuracy, completeness, or usefulness of any information provided.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Application and its original content, features, and functionality are and will remain 
              the exclusive property of Hairmama and its licensors. The service is protected by 
              copyright, trademark, and other laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, 
              publicly perform, republish, download, store, or transmit any of the material on our service, 
              except as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials</li>
              <li>You may store files that are automatically cached by your Web browser for display enhancement purposes</li>
              <li>You may print or download one copy of a reasonable number of pages of the Application for your own personal, non-commercial use</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
                             In no event shall Hairmama, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
              resulting from your use of the service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We strive to maintain the availability of our service, but we do not guarantee that the service 
              will be available at all times. We may suspend or discontinue the service at any time without notice.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior 
              notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
              including but not limited to a breach of the Terms.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using the service or contact us 
              to delete your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
                             These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
               Hairmama operates, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
                         <div className="bg-gray-100 p-4 rounded-lg">
               <p className="font-semibold">Hairmama</p>
               <p>Email: legal@hairmama.com</p>
               <p>Support: support@hairmama.com</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
