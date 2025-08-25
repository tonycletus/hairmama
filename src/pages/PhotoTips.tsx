import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Sparkles, Target, CheckCircle, ArrowRight, Lightbulb, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PhotoTips = () => {
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
              <Camera className="h-3 w-3 mr-1" />
              Photo Guide
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">How to Take Better Progress Photos</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master the art of progress photography to get the most accurate AI analysis and track your hair transformation journey effectively.
            </p>
          </div>
        </div>

        {/* Why Progress Photos Matter */}
        <Card className="mb-8 glass-card border-border/30">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why Progress Photos Are Essential</h2>
              <p className="text-muted-foreground mb-6">
                High-quality progress photos are the foundation of accurate AI analysis. They help our technology track subtle changes in your hair's health, texture, and growth patterns that you might not notice in the mirror.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="glass-card p-4 rounded-lg border-border/30">
                  <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Accurate AI Analysis</p>
                  <p className="text-muted-foreground">Better photos = more precise recommendations</p>
                </div>
                <div className="glass-card p-4 rounded-lg border-border/30">
                  <Target className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Track Progress</p>
                  <p className="text-muted-foreground">Visual proof of your hair transformation</p>
                </div>
                <div className="glass-card p-4 rounded-lg border-border/30">
                  <Sparkles className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Stay Motivated</p>
                  <p className="text-muted-foreground">See your improvements over time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Essential Equipment */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              Essential Equipment for Great Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              You don't need expensive equipment to take great progress photos. Here's what you need for optimal results with Hairmama's AI analysis.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Camera Options</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Smartphone Camera:</strong> Modern phones have excellent cameras. Use the back camera for better quality.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Digital Camera:</strong> If you have one, use it for even better detail and clarity.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Webcam:</strong> Good for consistent lighting and positioning.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Lighting Setup</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Natural Light:</strong> Best option - stand near a window during daylight hours.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Ring Light:</strong> Provides even, consistent lighting for professional results.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Avoid Flash:</strong> Can create harsh shadows and wash out details.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Setup Guide */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-accent" />
              Perfect Photo Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Follow these steps to create the perfect setup for consistent, high-quality progress photos that our AI can analyze effectively.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Step 1: Choose Your Location</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Find a well-lit area with natural light (near a window)</p>
                  <p>• Use a plain, neutral background (white wall works best)</p>
                  <p>• Ensure consistent lighting for all photos</p>
                  <p>• Avoid busy backgrounds that could distract from your hair</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-secondary-foreground">
                    <strong>Pro Tip:</strong> Mark your spot on the floor to ensure consistent positioning for every photo.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Step 2: Prepare Your Hair</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Wash and style your hair as you normally would</p>
                  <p>• Remove any accessories (clips, bands, etc.)</p>
                  <p>• Part your hair consistently (same side each time)</p>
                  <p>• Let your hair fall naturally</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 mt-4">
                  <p className="text-sm text-accent-foreground">
                    <strong>Pro Tip:</strong> Take photos at the same time of day for consistent lighting and hair condition.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-success pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Step 3: Position Yourself</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Stand at the same distance from the camera each time</p>
                  <p>• Keep your head level and straight</p>
                  <p>• Look directly at the camera</p>
                  <p>• Ensure your entire head and hair are in frame</p>
                </div>
                <div className="bg-success/10 p-4 rounded-lg border border-success/20 mt-4">
                  <p className="text-sm text-accent-foreground">
                    <strong>Pro Tip:</strong> Use a tripod or phone stand for consistent camera positioning.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Step 4: Take Multiple Angles</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>• Front view (full face and hair)</p>
                  <p>• Side view (left and right profiles)</p>
                  <p>• Back view (if possible with a mirror)</p>
                  <p>• Close-up of specific areas of concern</p>
                </div>
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20 mt-4">
                  <p className="text-sm text-warning-foreground">
                    <strong>Pro Tip:</strong> Our AI can analyze multiple angles to provide comprehensive hair health insights.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes to Avoid */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-warning" />
              Common Photo Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Avoid these common pitfalls that can affect the accuracy of your AI analysis and progress tracking.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-destructive">❌ What to Avoid</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Taking photos in different lighting conditions</li>
                  <li>• Using filters or editing apps</li>
                  <li>• Changing camera angles frequently</li>
                  <li>• Taking photos with wet or damp hair</li>
                  <li>• Using flash or harsh artificial lighting</li>
                  <li>• Including distracting backgrounds</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground text-success">✅ What to Do Instead</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Maintain consistent lighting and timing</li>
                  <li>• Use natural, unedited photos</li>
                  <li>• Stick to the same camera setup</li>
                  <li>• Wait for hair to dry completely</li>
                  <li>• Use soft, natural lighting</li>
                  <li>• Choose plain, neutral backgrounds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frequency and Timing */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-success" />
              Optimal Photo Frequency & Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Timing is everything when it comes to progress tracking. Here's the ideal schedule for taking progress photos with Hairmama.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 glass-card rounded-lg border-border/30">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Initial Assessment</h3>
                <p className="text-sm text-muted-foreground">Take your first set of photos when you start using Hairmama for baseline analysis.</p>
              </div>

              <div className="text-center p-6 glass-card rounded-lg border-border/30">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-foreground font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Weekly Updates</h3>
                <p className="text-sm text-muted-foreground">Take new photos every 2-4 weeks to track gradual improvements and changes.</p>
              </div>

              <div className="text-center p-6 glass-card rounded-lg border-border/30">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-success-foreground font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Milestone Tracking</h3>
                <p className="text-sm text-muted-foreground">Document significant changes after treatments, trims, or major routine changes.</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-lg border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-3">The Hairmama Advantage</h3>
              <p className="text-muted-foreground mb-4">
                Our AI technology can detect subtle changes that might not be visible to the naked eye. Regular progress photos help our system provide more accurate recommendations and track your hair's health over time.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="border-success text-success hover:bg-success hover:text-success-foreground"
              >
                Start Your Progress Journey
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tips */}
        <Card className="mb-8 glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="h-6 w-6 text-warning" />
              Advanced Photography Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Take your progress photography to the next level with these advanced techniques for even better AI analysis results.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warning font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Use a Tripod</h4>
                  <p className="text-muted-foreground text-sm">Eliminate camera shake and ensure consistent positioning for every photo.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warning font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Create a Photo Log</h4>
                  <p className="text-muted-foreground text-sm">Keep notes of your hair care routine, products used, and any treatments between photos.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warning font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Use Grid Lines</h4>
                  <p className="text-muted-foreground text-sm">Enable camera grid lines to ensure your head is centered and level in every shot.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 glass-card rounded-lg border-border/30">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warning font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Focus on Details</h4>
                  <p className="text-muted-foreground text-sm">Take close-up shots of specific areas like split ends, scalp condition, or problem areas.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="glass-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Hair Progress Journey?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of users who are tracking their hair transformation with Hairmama's AI-powered analysis.
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

export default PhotoTips;
