import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

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
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="glass-secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Hair Analysis
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Upload Your Hair Photo
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Get Instant Analysis </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Simply upload a photo of your hair and get detailed AI analysis including health score, 
                  recommendations, and personalized care tips in seconds.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="group"
                  onClick={() => navigate("/auth")}
                >
                  Upload Photo & Analyze
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="lg">
                  How It Works
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Free analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Results in seconds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>No registration required</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-6 rounded-2xl">
                <img 
                  src={heroImage}
                  alt="Hair analysis example"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
              {/* Floating results card */}
              <div className="absolute -top-4 -right-4 glass-secondary p-4 rounded-xl shadow-lg">
                <div className="text-sm">
                  <div className="font-medium">Health Score: 85%</div>
                  <div className="text-muted-foreground">Good condition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get your hair analysis in 3 simple steps
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
              <Card key={index} className="glass-card hover-glow border-border/30 text-center">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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
              <a href="#" className="hover:text-foreground transition-smooth">Privacy</a>
              <a href="#" className="hover:text-foreground transition-smooth">Terms</a>
              <a href="#" className="hover:text-foreground transition-smooth">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
            © 2024 Hairmama. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;