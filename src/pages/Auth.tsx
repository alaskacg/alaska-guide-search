import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowLeft, CheckCircle, Sparkles, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import BetaBanner from "@/components/BetaBanner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "You've successfully signed in." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { first_name: firstName, last_name: lastName }
          }
        });
        if (error) throw error;
        setEmailSent(true);
        toast({ 
          title: "Verification email sent!", 
          description: "Please check your inbox and click the verification link to complete signup." 
        });
      }
    } catch (error: any) {
      let message = error.message;
      if (message.includes("User already registered")) {
        message = "An account with this email already exists. Try signing in instead.";
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="glass rounded-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mx-auto mb-6"
            >
              <CheckCircle className="h-8 w-8 text-green-500" />
            </motion.div>

            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Check Your Email
            </h1>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to <strong className="text-foreground">{email}</strong>. 
              Click the link in the email to verify your account and complete signup.
            </p>

            <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-left mb-6">
              <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Gift className="h-4 w-4 text-accent" />
                Beta Benefit
              </h3>
              <p className="text-sm text-muted-foreground">
                As a beta user, you'll enjoy free access to all features. 
                Guides can list for free until we exit beta!
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Use a different email
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="glass rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <Logo size="md" showText={true} />
            <BetaBanner variant="compact" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isLogin ? "Sign in to continue your adventure" : "Join Alaska's premier guide platform"}
          </p>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/30"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Beta Launch Special</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create your account now and enjoy free access during our beta period. 
                    Guides can list for free — no subscription fees until we officially launch!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10" placeholder="John" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" placeholder="Doe" />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="••••••••" required minLength={6} />
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>

          {!isLogin && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
