import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  BookOpen, 
  Camera, 
  Target, 
  Shield, 
  Phone,
  Clock,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();
  
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button on the homepage and follow the registration process. You'll need to provide your email address and create a password."
        },
        {
          question: "How do I take the hair assessment quiz?",
          answer: "Navigate to the Dashboard and click on 'Take Hair Assessment' to begin the quiz. Answer all questions honestly for the best recommendations."
        },
        {
          question: "Can I change my hair goals later?",
          answer: "Yes! You can update your hair goals anytime by going to the Goals page and editing your current goals."
        }
      ]
    },
    {
      category: "Photo Features",
      questions: [
        {
          question: "How do I upload hair photos?",
          answer: "Go to the Progress section and click 'Upload Photo'. Make sure to take photos in good lighting and from consistent angles for accurate tracking."
        },
        {
          question: "What photo formats are supported?",
          answer: "We support JPEG, PNG, and WebP formats. Photos should be under 10MB for optimal performance."
        },
        {
          question: "How often should I take progress photos?",
          answer: "We recommend taking photos every 2-4 weeks to track your hair care progress effectively."
        }
      ]
    },
    {
      category: "Ingredient Checker",
      questions: [
        {
          question: "How accurate is the ingredient checker?",
          answer: "Our ingredient database is regularly updated with the latest research. However, individual reactions may vary, so always patch test new products."
        },
        {
          question: "Can I check multiple ingredients at once?",
          answer: "Yes! Simply paste the full ingredient list from your product, and our system will analyze all ingredients simultaneously."
        },
        {
          question: "What do the safety ratings mean?",
          answer: "Safety ratings range from 1-10, where 1 is very safe and 10 indicates potential concerns. We provide detailed explanations for each rating."
        }
      ]
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email address."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account in the Settings page. This will permanently remove all your data from our system."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, we use industry-standard encryption and security measures to protect your personal information and photos."
        }
      ]
    }
  ];



  const resources = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Hair Care Guide",
      description: "Comprehensive guide to hair care basics",
      link: "/hair-care-guide"
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Photo Tips",
      description: "How to take better progress photos",
      link: "/photo-tips"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Goal Setting",
      description: "Tips for setting achievable hair goals",
      link: "/goal-setting"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Ingredient Safety",
      description: "Understanding ingredient safety ratings",
      link: "/ingredient-safety"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
                 {/* Header */}
         <div className="text-center mb-12">
           <Button
             variant="ghost"
             onClick={() => navigate(-1)}
             className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 mx-auto"
           >
             <ArrowLeft className="h-4 w-4" />
             Back
           </Button>
           <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Need help with Hairmama? We're here to assist you with any questions or issues you may have.
           </p>
         </div>

                          {/* Support Channels */}
         <div className="mb-12">
           <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Help</h2>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Choose the best way to get the support you need
             </p>
           </div>
           
           <div className="max-w-4xl mx-auto">
             <div className="grid md:grid-cols-2 gap-8">
               {/* Email Support */}
               <Card className="hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-200">
                 <CardHeader className="text-center pb-4">
                   <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Mail className="h-8 w-8 text-white" />
                   </div>
                   <CardTitle className="text-xl text-gray-900">Email Support</CardTitle>
                   <p className="text-gray-600">Get detailed help via email</p>
                 </CardHeader>
                 <CardContent className="text-center space-y-4">
                   <div className="bg-blue-50 rounded-lg p-4">
                     <p className="text-sm font-medium text-blue-900">support@hairmama.com</p>
                     <p className="text-xs text-blue-700 mt-1">Response within 24 hours</p>
                   </div>
                   <div className="space-y-2 text-sm text-gray-600">
                     <p>• Detailed responses to complex issues</p>
                     <p>• Attach screenshots and files</p>
                     <p>• Track conversation history</p>
                   </div>
                                       <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open('mailto:support@hairmama.com?subject=Hairmama Support Request', '_blank')}
                    >
                      Send Email
                    </Button>
                 </CardContent>
               </Card>

               {/* Phone Support */}
               <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-100 hover:border-green-200">
                 <CardHeader className="text-center pb-4">
                   <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Phone className="h-8 w-8 text-white" />
                   </div>
                   <CardTitle className="text-xl text-gray-900">Phone Support</CardTitle>
                   <p className="text-gray-600">Speak directly with our team</p>
                 </CardHeader>
                 <CardContent className="text-center space-y-4">
                   <div className="bg-green-50 rounded-lg p-4">
                     <p className="text-sm font-medium text-green-900">+1 (555) 123-4567</p>
                     <p className="text-xs text-green-700 mt-1">Mon-Fri, 9 AM - 6 PM EST</p>
                   </div>
                   <div className="space-y-2 text-sm text-gray-600">
                     <p>• Immediate assistance</p>
                     <p>• Real-time problem solving</p>
                     <p>• Personalized guidance</p>
                   </div>
                                       <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open('tel:+15551234567', '_blank')}
                    >
                      Call Now
                    </Button>
                 </CardContent>
               </Card>
             </div>

             {/* Quick Help Info */}
             <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
               <div className="text-center">
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Immediate Help?</h3>
                 <p className="text-gray-600 mb-4">
                   Our support team is here to help you get the most out of Hairmama
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
                   <div className="flex items-center space-x-2">
                     <Clock className="h-4 w-4 text-purple-600" />
                     <span>Available Monday through Friday</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Mail className="h-4 w-4 text-blue-600" />
                     <span>24/7 Email Support</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

        

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex}>
                        <details className="group">
                          <summary className="flex justify-between items-center cursor-pointer list-none">
                            <span className="font-medium text-gray-900 group-open:text-blue-600">
                              {faq.question}
                            </span>
                            <span className="text-blue-600 group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <div className="mt-3 pl-4 border-l-2 border-gray-200">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        </details>
                        {faqIndex < category.questions.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Helpful Resources</h2>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
             {resources.map((resource, index) => (
               <Card 
                 key={index} 
                 className="hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => navigate(resource.link)}
               >
                 <CardContent className="p-4">
                   <div className="flex items-center space-x-3">
                     <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                       {resource.icon}
                     </div>
                     <div>
                       <h3 className="font-medium text-gray-900">{resource.title}</h3>
                       <p className="text-sm text-gray-600">{resource.description}</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>

        
      </div>
    </div>
  );
};

export default Support;
