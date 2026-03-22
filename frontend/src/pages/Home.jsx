import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../components/ui/accordion';
import {
  ArrowRight,
  Shield,
  Users,
  Heart,
  Calendar,
  Star,
  UserPlus,
  Settings,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your child\'s information is protected with enterprise-grade security.',
    },
    {
      icon: Users,
      title: 'Family Connect',
      description: 'Stay connected with caregivers, family members, and educators.',
    },
    {
      icon: Heart,
      title: 'Health Tracking',
      description: 'Monitor growth, milestones, and wellness in one place.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Coordinate appointments, activities, and important dates effortlessly.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Active Families' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' },
    { number: '150+', label: 'Countries Served' },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up in minutes with your email and basic information.',
    },
    {
      icon: Settings,
      title: 'Set Up Your Profile',
      description: 'Add your children, family members, and preferences.',
    },
    {
      icon: Sparkles,
      title: 'Start Connecting',
      description: 'Begin managing care, tracking milestones, and staying organized.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Mother of 2',
      content: 'ChildNest has transformed how we manage our family schedule. Everything we need is in one place, and sharing updates with grandparents has never been easier.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Father of 1',
      content: 'The health tracking features are incredible. We can see growth charts, vaccination records, and doctor notes all organized beautifully. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Mother of 3',
      content: 'As a busy mom of three, ChildNest keeps me sane. The calendar sync and reminder features ensure I never miss important appointments or milestones.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How secure is my child\'s information?',
      answer: 'We use enterprise-grade encryption and comply with all major privacy regulations including GDPR and COPPA. Your data is stored securely and never shared with third parties without your explicit consent.',
    },
    {
      question: 'Can I share access with family members?',
      answer: 'Yes! You can invite grandparents, partners, caregivers, and other trusted family members. You control what information each person can see and edit.',
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Our responsive web app works beautifully on all devices. Native iOS and Android apps are currently in development and will be released soon.',
    },
    {
      question: 'What happens if I forget my password?',
      answer: 'Simply click "Forgot Password" on the login page. We\'ll send you a secure link to reset your password via email.',
    },
    {
      question: 'Can I export my child\'s data?',
      answer: 'Absolutely! You can export all your data at any time in multiple formats including PDF and CSV. Your data belongs to you.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">


            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Everything you need
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                for your child's care
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform designed to simplify parenting, connect families,
              and ensure your child thrives at every stage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button asChild size="lg" className="rounded-full bg-neutral-900 hover:bg-neutral-800 px-8 h-12 text-base">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-border hover:bg-secondary">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-green-100 to-emerald-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Stats Section */}
      <section id="features" className="px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-semibold text-foreground">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Features Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              Built for modern families
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Powerful features that make parenting easier and keep your family connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                    <feature.icon className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 md:py-32 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              How it works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-white text-sm font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              Loved by families everywhere
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              See what parents are saying about ChildNest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border bg-card"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed text-sm">
                    "{testimonial.content}"
                  </p>
                  <div className="pt-2">
                    <div className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 md:py-32 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about ChildNest.
            </p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Still have questions?{' '}
              <a href="#" className="text-foreground font-medium hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border bg-gradient-to-br from-secondary to-card overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Join thousands of families who trust ChildNest for their child care coordination.
              </p>
              <div className="pt-4">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-8 h-12 text-base">
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;