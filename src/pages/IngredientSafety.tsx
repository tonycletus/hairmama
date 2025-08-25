import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Sparkles, CheckCircle, ArrowRight, AlertTriangle, Info, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const IngredientSafety = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </Button>
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Shield className="h-3 w-3 mr-2" />
              Safety Guide
            </Badge>
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              Understanding Ingredient Safety Ratings
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master the science behind ingredient safety and learn how Hairmama's AI technology helps you make informed decisions about your hair care products.
            </p>
          </div>
        </div>

        {/* Why Ingredient Safety Matters */}
        <Card className="mb-12 glass-card border-border/20 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-foreground">Why Ingredient Safety Matters</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your scalp is highly absorbent, and what you put on your hair can affect your overall health. Understanding ingredient safety helps you make informed choices and avoid potential irritants or harmful substances.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Protect Your Health</h3>
                  <p className="text-muted-foreground leading-relaxed">Avoid harmful ingredients that can cause irritation or long-term damage</p>
                </div>
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Optimize Results</h3>
                  <p className="text-muted-foreground leading-relaxed">Choose ingredients that work best for your specific hair type and concerns</p>
                </div>
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Info className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Make Informed Choices</h3>
                  <p className="text-muted-foreground leading-relaxed">Understand what you're putting on your hair and why it matters</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Rating System */}
        <Card className="mb-12 glass-card border-border/20 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              Hairmama's Safety Rating System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI-powered system analyzes ingredients based on scientific research, potential risks, and compatibility with different hair types. Here's how our safety ratings work:
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-success-foreground font-bold text-xl">1-3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Safe (Green)</h3>
                  <p className="text-muted-foreground leading-relaxed">Generally safe for most hair types. Well-researched ingredients with minimal risk of irritation or harm.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-16 h-16 bg-warning rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-warning-foreground font-bold text-xl">4-6</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Moderate (Yellow)</h3>
                  <p className="text-muted-foreground leading-relaxed">May cause issues for sensitive scalps or certain hair types. Use with caution and patch test first.</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-16 h-16 bg-destructive rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-destructive-foreground font-bold text-xl">7-10</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">High Risk (Red)</h3>
                  <p className="text-muted-foreground leading-relaxed">Known irritants or potentially harmful ingredients. Avoid if possible, especially for sensitive scalps.</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-secondary/20">
              <p className="text-secondary-foreground leading-relaxed">
                <strong>AI Analysis:</strong> Our system considers your specific hair type, scalp sensitivity, and existing conditions when rating ingredients for you personally.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Common Ingredients Guide */}
        <Card className="mb-12 glass-card border-border/20 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Info className="h-6 w-6 text-accent" />
              </div>
              Common Ingredients & Their Safety Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Understanding common hair care ingredients helps you make better product choices. Here's what you need to know about frequently used ingredients.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground text-success flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  Generally Safe Ingredients
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Aloe Vera:</strong> 
                      <span className="text-muted-foreground ml-2">Soothing, moisturizing, and safe for most hair types</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Coconut Oil:</strong> 
                      <span className="text-muted-foreground ml-2">Natural moisturizer, great for dry hair</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Argan Oil:</strong> 
                      <span className="text-muted-foreground ml-2">Lightweight, nourishing oil for all hair types</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Shea Butter:</strong> 
                      <span className="text-muted-foreground ml-2">Rich moisturizer, excellent for dry, damaged hair</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground text-destructive flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" />
                  Ingredients to Watch
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Sulfates:</strong> 
                      <span className="text-muted-foreground ml-2">Can strip natural oils, may irritate sensitive scalps</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Parabens:</strong> 
                      <span className="text-muted-foreground ml-2">Preservatives with potential health concerns</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Formaldehyde:</strong> 
                      <span className="text-muted-foreground ml-2">Known carcinogen, avoid in all products</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Phthalates:</strong> 
                      <span className="text-muted-foreground ml-2">Plasticizers linked to health issues</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Use the Ingredient Checker */}
        <Card className="mb-12 glass-card border-border/20 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              How to Use Hairmama's Ingredient Checker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI-powered ingredient checker makes it easy to analyze any hair care product. Here's how to get the most out of this powerful tool.
            </p>

            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-8 space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Step 1: Find the Ingredient List</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Look for the ingredient list on the product packaging</p>
                  <p>• Ingredients are listed in order of concentration (highest first)</p>
                  <p>• Copy the full list or take a clear photo</p>
                  <p>• Include all ingredients for accurate analysis</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg border border-secondary/20">
                  <p className="text-secondary-foreground">
                    <strong>Pro Tip:</strong> The first 5-10 ingredients make up the majority of the product, so pay special attention to these.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-accent pl-8 space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Step 2: Input Ingredients</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Paste the ingredient list into our checker</p>
                  <p>• Our AI will automatically parse and analyze each ingredient</p>
                  <p>• The system considers your hair type and sensitivity</p>
                  <p>• Get instant safety ratings and explanations</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <p className="text-accent-foreground">
                    <strong>AI Advantage:</strong> Our system learns from your preferences and provides increasingly personalized recommendations.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-success pl-8 space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Step 3: Review Results</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Check the overall safety score</p>
                  <p>• Review individual ingredient ratings</p>
                  <p>• Read detailed explanations for each ingredient</p>
                  <p>• Get personalized recommendations</p>
                </div>
                <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                  <p className="text-warning-foreground">
                    <strong>Smart Analysis:</strong> Our system can suggest safer alternatives and explain why certain ingredients might not work for your hair type.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-warning pl-8 space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Step 4: Make Informed Decisions</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Use the safety ratings to guide your purchase</p>
                  <p>• Consider your specific hair needs and sensitivities</p>
                  <p>• Look for safer alternatives if needed</p>
                  <p>• Always patch test new products</p>
                </div>
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <p className="text-warning-foreground">
                    <strong>Safety First:</strong> Even "safe" ingredients can cause reactions in some people. Always test products on a small area first.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Ingredient Claims */}
        <Card className="mb-12 glass-card border-border/20 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              Understanding Product Claims & Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Don't be fooled by marketing claims. Learn how to read between the lines and make truly informed decisions about your hair care products.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground text-destructive">❌ Misleading Claims</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• "Natural" - Not regulated, can still contain harmful ingredients</li>
                  <li>• "Chemical-free" - Everything is made of chemicals</li>
                  <li>• "Dermatologist tested" - Doesn't mean approved or safe</li>
                  <li>• "Hypoallergenic" - No legal definition, varies by brand</li>
                  <li>• "Organic" - May only apply to some ingredients</li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground text-success">✅ What to Look For</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Complete ingredient lists (not just "key ingredients")</li>
                  <li>• Third-party certifications (EWG Verified, USDA Organic)</li>
                  <li>• Transparent company practices</li>
                  <li>• Scientific backing for claims</li>
                  <li>• Customer reviews and experiences</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-8 rounded-xl border-border/20">
              <h3 className="text-2xl font-semibold text-foreground mb-4">The Hairmama Difference</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our AI doesn't rely on marketing claims. Instead, it analyzes the actual ingredients based on scientific research and your personal hair profile. Get unbiased, data-driven recommendations that truly work for your hair.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="border-warning text-warning hover:bg-warning hover:text-warning-foreground transition-colors"
              >
                Try Our Ingredient Checker
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="mb-12 glass-card border-border/20 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              Essential Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Follow these essential safety practices to protect your hair and scalp health while achieving your hair goals.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold text-lg">1</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-foreground">Always Patch Test</h4>
                  <p className="text-muted-foreground leading-relaxed">Test new products on a small area of your scalp or behind your ear for 24-48 hours before full use.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold text-lg">2</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-foreground">Read Labels Carefully</h4>
                  <p className="text-muted-foreground leading-relaxed">Don't just rely on front-of-package claims. Always check the full ingredient list.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold text-lg">3</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-foreground">Consider Your Hair Type</h4>
                  <p className="text-muted-foreground leading-relaxed">What works for one hair type may not work for another. Our AI considers your specific characteristics.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold text-lg">4</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-foreground">Listen to Your Scalp</h4>
                  <p className="text-muted-foreground leading-relaxed">If a product causes irritation, itching, or burning, stop using it immediately.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 glass-card rounded-xl border-border/20">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-success font-bold text-lg">5</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-foreground">Consult Professionals</h4>
                  <p className="text-muted-foreground leading-relaxed">For severe reactions or persistent issues, consult a dermatologist or trichologist.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="glass-primary text-primary-foreground shadow-2xl">
          <CardContent className="p-12 text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">Ready to Check Your Products?</h2>
            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
              Join thousands of users who are making safer, more informed choices about their hair care with Hairmama's AI-powered ingredient analysis.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-background text-foreground hover:bg-muted transition-colors px-8 py-3 text-lg"
              size="lg"
            >
              Start Free Ingredient Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IngredientSafety;
