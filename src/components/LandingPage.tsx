import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, Sparkles, CheckCircle, Twitter, Linkedin, Instagram, Target, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import heroImage from "@/assets/hero-image.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Camera className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Hairmama</span>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/dashboard")}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="glass-secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Hair Analysis
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Transform Your Hair Journey with
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> AI-Powered Insights </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Experience the future of hair care with our advanced AI technology. Get comprehensive analysis, 
                  personalized recommendations, and track your progress with scientific precision.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="group shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate("/dashboard")}
                    >
                      Continue Your Journey
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="glass" 
                      size="lg" 
                      className="hover:bg-primary/10 transition-all duration-300"
                      onClick={() => navigate("/goals")}
                    >
                      View Progress
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="group shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate("/auth")}
                    >
                      Start Your Hair Journey
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="glass" size="lg" className="hover:bg-primary/10 transition-all duration-300">
                      See How It Works
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Advanced AI Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Scientific Precision</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                <img 
                  src={heroImage}
                  alt="Hair analysis example"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
              {/* Floating results card */}
              <div className="absolute -top-4 -right-4 glass-secondary p-4 rounded-xl shadow-lg animate-pulse">
                <div className="text-sm">
                  <div className="font-medium text-success">Health Score: 92%</div>
                  <div className="text-muted-foreground">Excellent condition</div>
                </div>
              </div>
              {/* Additional floating element */}
              <div className="absolute -bottom-4 -left-4 glass-primary p-3 rounded-xl shadow-lg">
                <div className="text-xs">
                  <div className="font-medium">AI Analysis</div>
                  <div className="text-green-200">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="glass-secondary mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Simple & Effective
            </Badge>
            <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Experience the power of AI in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Photo",
                description: "Take or upload a clear photo of your hair from any angle"
              },
              {
                step: "2", 
                title: "AI Analysis",
                description: "Our AI analyzes your hair health, texture, and condition"
              },
              {
                step: "3",
                title: "Get Results",
                description: "Receive detailed analysis and personalized recommendations"
              }
            ].map((item, index) => (
              <Card key={index} className="glass-card hover-glow border-border/30 text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="glass-secondary mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Advanced Features
            </Badge>
            <h2 className="text-4xl font-bold text-foreground">Why Choose Hairmama?</h2>
            <p className="text-xl text-muted-foreground">
              Discover the cutting-edge features that make us the leading hair care platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="h-8 w-8" />,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning algorithms provide accurate hair health assessments and personalized recommendations."
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Progress Tracking",
                description: "Monitor your hair journey with detailed progress reports and visual comparisons over time."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Ingredient Safety",
                description: "Check product ingredients for safety and compatibility with your hair type and concerns."
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "Personalized Routines",
                description: "Get customized hair care routines based on your unique hair characteristics and goals."
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Expert Insights",
                description: "Access professional hair care advice and tips from certified trichologists and stylists."
              },
              {
                icon: <ArrowRight className="h-8 w-8" />,
                title: "Continuous Learning",
                description: "Our AI continuously improves to provide more accurate and personalized recommendations."
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-card border-border/30 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Camera className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Hairmama</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-smooth">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-smooth">Terms</a>
              <a href="/support" className="hover:text-foreground transition-smooth">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Hairmama. All rights reserved.
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;