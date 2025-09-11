import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, MapPin, Bell, BarChart3, Users, Shield, Zap, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { IssueStatsChart } from "@/components/charts/IssueStatsChart";
import { useAuth } from "@/hooks/useAuth";
import civicHeroImage from "@/assets/civic-hero.jpg";

const Homepage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-gradient-hero text-primary-foreground overflow-hidden min-h-[80vh] flex items-center"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${civicHeroImage})` }}
          />
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative container mx-auto px-4 py-24"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Report Civic Issues,
                <br />
                <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/70 bg-clip-text text-transparent">
                  Get Them Resolved
                </span>
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto"
              >
                A simple way for citizens to connect with local authorities and track the progress of community improvements.
              </motion.p>
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                  <Link to={user ? "/report" : "/auth"}>
                    {user ? "Report an Issue" : "Get Started"}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:scale-105 transition-transform">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    {user ? "Track My Reports" : "Sign In"}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/20 to-transparent"></div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-20 left-10 p-4 bg-background/10 backdrop-blur-sm rounded-full"
          >
            <Zap className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-32 right-16 p-4 bg-background/10 backdrop-blur-sm rounded-full"
          >
            <CheckCircle className="w-6 h-6 text-primary-foreground" />
          </motion.div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to report issues and track their resolution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "1. Submit a Report",
                description: "Fill out a simple form with photos and location details. Takes just 2 minutes.",
                button: "Start Reporting",
                link: user ? "/report" : "/auth",
                variant: "civic" as const,
                delay: 0.2
              },
              {
                icon: BarChart3,
                title: "2. Track Progress",
                description: "Monitor real-time updates in your personal dashboard as authorities work on your issue.",
                button: "View Dashboard",
                link: user ? "/dashboard" : "/auth",
                variant: "civic" as const,
                delay: 0.4
              },
              {
                icon: Bell,
                title: "3. Get Resolution",
                description: "Receive notifications when your issue is resolved and see the final results.",
                button: "Learn More",
                link: "/help",
                variant: "success" as const,
                delay: 0.6
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card className="text-center p-8 shadow-card hover:shadow-elevated transition-all duration-300 border-border/50 bg-background/95 backdrop-blur-sm h-full">
                  <CardContent className="pt-6">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground mb-6">
                      {step.description}
                    </p>
                    <Button asChild variant={step.variant} size="sm" className="hover:scale-105 transition-transform">
                      <Link to={step.link}>{step.button}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

      {/* Quick Links */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-8 h-8 text-civic-blue mr-3" />
                    <h3 className="text-xl font-semibold">Track My Reports</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    View the status of all your submitted reports in one place. Get real-time updates and communicate with authorities.
                  </p>
                  <Button asChild variant="civic" className="w-full">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-8 bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-civic-green mr-3" />
                    <h3 className="text-xl font-semibold">Need Help?</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Find answers to common questions, learn how to use the system, or contact our support team for assistance.
                  </p>
                  <Button asChild variant="success" className="w-full">
                    <Link to="/help">View FAQs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

        {/* Analytics Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Community Analytics</h2>
            <p className="text-xl text-muted-foreground">
              Real-time insights into our civic engagement platform
            </p>
          </div>

          <IssueStatsChart />
        </motion.section>

        {/* Statistics */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
            <p className="text-xl text-muted-foreground">
              See how our community works together to improve our city
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: FileText, value: "2,847", label: "Issues Reported", color: "text-civic-blue" },
              { icon: CheckCircle, value: "2,156", label: "Issues Resolved", color: "text-civic-green" },
              { icon: Clock, value: "3.2", label: "Avg Days to Resolve", color: "text-civic-amber" },
              { icon: TrendingUp, value: "96%", label: "Satisfaction Rate", color: "text-civic-blue" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="p-6 shadow-card border-border/50 bg-background/95 backdrop-blur-sm">
                  <CardContent className="pt-0">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`text-4xl font-bold mb-2 ${stat.color}`}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Homepage;