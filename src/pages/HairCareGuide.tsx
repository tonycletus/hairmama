import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Camera, Target, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HairCareGuide = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </Button>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Expert Guide
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">The Complete Hair Care Guide</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master the fundamentals of hair care with our comprehensive guide. Learn the science behind healthy hair and discover how Hairmama's AI technology can revolutionize your hair journey.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 glass-card border-border/30">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-6">
                Understanding your hair is the first step to achieving your hair goals. This guide combines decades of hair care expertise with cutting-edge AI technology to give you the most personalized approach to hair care.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Your Hair Journey with AI Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Hair Types */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Understanding Your Hair Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Your hair is as unique as you are. Understanding your hair type is crucial for choosing the right products and routines. Hairmama's AI analysis can identify your specific hair characteristics in seconds.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Hair Texture</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span><strong>Fine:</strong> Thin strands that need lightweight products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span><strong>Medium:</strong> Balanced thickness, most versatile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span><strong>Coarse:</strong> Thick strands that need rich moisturizers</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Hair Porosity</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span><strong>Low:</strong> Cuticles are tight, needs heat to absorb products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span><strong>Medium:</strong> Balanced absorption, most common</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span><strong>High:</strong> Cuticles are open, absorbs products quickly</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Hair Care Routine */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              The Perfect Hair Care Routine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              A consistent hair care routine is the foundation of healthy hair. Our AI technology can create a personalized routine based on your unique hair characteristics and goals.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 1: Cleansing</h3>
                <p className="text-muted-foreground mb-3">
                  Choose a shampoo that matches your hair type and concerns. For dry hair, look for moisturizing ingredients. For oily hair, opt for clarifying formulas.
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-secondary-foreground">
                    <strong>Pro Tip:</strong> Use Hairmama's ingredient checker to ensure your shampoo is safe and effective for your specific hair type.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 2: Conditioning</h3>
                <p className="text-muted-foreground mb-3">
                  Conditioner helps restore moisture and smooth the hair cuticle. Apply from mid-length to ends, avoiding the scalp for most hair types.
                </p>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>Pro Tip:</strong> Our AI can recommend the perfect conditioner based on your hair's moisture needs and texture.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-success pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: Treatment</h3>
                <p className="text-muted-foreground mb-3">
                  Weekly treatments address specific concerns like damage, dryness, or scalp issues. Deep conditioners, masks, and scalp treatments are essential.
                </p>
                <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>Pro Tip:</strong> Track your treatment results with Hairmama's progress photos to see what works best for your hair.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 4: Styling</h3>
                <p className="text-muted-foreground mb-3">
                  Protect your hair from heat damage and use products that enhance your natural texture. Less is often more when it comes to styling products.
                </p>
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <p className="text-sm text-warning-foreground">
                    <strong>Pro Tip:</strong> Our AI can analyze your styling habits and suggest improvements to minimize damage and maximize results.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Hair Problems */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-destructive" />
              Common Hair Problems & Solutions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Every hair journey has challenges. Here's how to address common issues with the help of Hairmama's AI-powered recommendations.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Dry & Damaged Hair</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use sulfate-free shampoos</li>
                  <li>• Incorporate protein treatments</li>
                  <li>• Limit heat styling</li>
                  <li>• Regular deep conditioning</li>
                </ul>
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>AI Insight:</strong> Our analysis can detect early signs of damage and recommend preventive measures.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Oily Scalp</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Clarifying shampoos</li>
                  <li>• Scalp exfoliation</li>
                  <li>• Avoid over-conditioning</li>
                  <li>• Balance oil production</li>
                </ul>
                <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>AI Insight:</strong> We can identify the root cause and suggest targeted solutions.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Hair Loss</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Gentle hair care practices</li>
                  <li>• Scalp health focus</li>
                  <li>• Nutritional support</li>
                  <li>• Stress management</li>
                </ul>
                <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>AI Insight:</strong> Track hair density changes over time with our photo analysis.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Frizz & Flyaways</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Humidity-resistant products</li>
                  <li>• Smoothing treatments</li>
                  <li>• Proper sealing techniques</li>
                  <li>• Anti-frizz serums</li>
                </ul>
                <div className="bg-warning/10 p-3 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    <strong>AI Insight:</strong> Our analysis can determine your hair's humidity sensitivity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition for Hair */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              Nutrition for Healthy Hair
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              What you eat directly impacts your hair health. A balanced diet rich in essential nutrients supports strong, shiny hair from the inside out.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">Ω</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Omega-3 Fatty Acids</h3>
                <p className="text-sm text-muted-foreground">Found in fish, nuts, and seeds. Promotes scalp health and reduces inflammation.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-success font-bold">Fe</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Iron</h3>
                <p className="text-sm text-muted-foreground">Essential for oxygen transport to hair follicles. Found in lean meats and leafy greens.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">Zn</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Zinc</h3>
                <p className="text-sm text-muted-foreground">Supports hair growth and repair. Found in oysters, nuts, and whole grains.</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-lg border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-3">The Hairmama Advantage</h3>
              <p className="text-muted-foreground mb-4">
                Our AI technology can analyze your hair's condition and suggest dietary changes that complement your hair care routine. Get personalized nutrition recommendations based on your specific hair concerns.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Get Personalized Nutrition Tips
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="glass-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hair Journey?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of users who have discovered their perfect hair care routine with Hairmama's AI technology.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-background text-foreground hover:bg-muted"
                size="lg"
              >
                Start Free Hair Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HairCareGuide;
