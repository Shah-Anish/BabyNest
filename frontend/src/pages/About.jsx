import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Heart, Users, Shield, Target, Award, Clock } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Family First',
      description: 'We believe every family deserves the best tools to care for their children.',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your family\'s data is protected with enterprise-grade security measures.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built with feedback from parents, caregivers, and healthcare professionals.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Continuously improving to meet the evolving needs of modern families.',
    },
  ];

  const milestones = [
    { year: '2023', title: 'Founded', description: 'BabyNest was born from a parent\'s need for better child care coordination in Nepal.' },
    { year: '2024', title: 'Growth', description: 'Reached 5,000 active families across Nepal.' },
    { year: '2025', title: 'Expansion', description: 'Launched mobile apps and advanced health tracking features.' },
    { year: '2026', title: 'Innovation', description: 'Serving 15,000+ families with AI-powered insights and recommendations.' },
  ];

  const team = [
    { name: 'Healthcare Experts', count: '10+', description: 'Pediatricians and child development specialists' },
    { name: 'Engineers', count: '15+', description: 'Building secure and scalable technology' },
    { name: 'Support Team', count: '20+', description: 'Available 24/7 to help families' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border">
                About Us
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Empowering families
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                one child at a time
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              BabyNest is a comprehensive platform designed to simplify child care coordination,
              connect families, and ensure every child gets the best start in life.
            </p>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-green-100 to-emerald-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Mission Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At BabyNest, we're on a mission to revolutionize child care coordination.
                We understand that caring for a child involves countless details, appointments,
                milestones, and decisions. Our platform brings everything together in one place,
                making it easier for families to stay organized and connected.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're tracking vaccinations, coordinating with caregivers, monitoring growth,
                or scheduling appointments, BabyNest gives you the tools to focus on what matters most:
                your child's happiness and wellbeing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, value: '15K+', label: 'Active Families' },
                { icon: Shield, value: '99.9%', label: 'Uptime' },
                { icon: Award, value: '4.9/5', label: 'User Rating' },
                { icon: Users, value: '77+', label: 'Districts Served' },
              ].map((stat, index) => (
                <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-green-700" />
                      </div>
                    </div>
                    <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Values Section */}
      <section className="px-6 py-20 md:py-32 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at BabyNest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                    <value.icon className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a simple idea to serving thousands of families worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Team Section */}
      <section className="px-6 py-20 md:py-32 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to helping families thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-border bg-card text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="text-4xl md:text-5xl font-bold text-primary">
                    {member.count}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
