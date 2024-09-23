"use client"

import "./globals.css";
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { BarChart as BarChartIcon, Globe, Leaf, Phone, Mail, MapPin, Menu } from "lucide-react"
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Component() {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [yieldResult, setYieldResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  const [formData, setFormData] = useState({
    Area: '',
    Item: '',
    Year: '',
    average_rain_fall_mm_per_year: '',
    pesticides_tonnes: '',
    avg_temp: '',
  })

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'impact', 'predict', 'results', 'about', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setMenuOpen(false);
      setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      });
    }
  };

  const NavLink = ({ href, children, section, onClick }) => (
    <a
      className={`relative inline-block transition-colors duration-200 ${activeSection === section ? 'text-primary font-bold' : 'text-foreground/60'
        }`}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(section);
        if (onClick) onClick();
      }}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300`}
        style={{ marginBottom: -3 }}
      />
      <style jsx>{`
        a {
          position: relative;
        }
        a span {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 0%;
          content: '.';
          color: transparent;
          background: black;
          height: 1px;
          transition: width 0.3s;
        }
        a:hover span {
          width: 100%;
        }
      `}</style>
    </a>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch('http://localhost:8867/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setYieldResult(data.prediction);
    const chartData = Object.entries(data.prediction).map(([model, prediction]) => ({
      model,
      yield: prediction.yield,
      category: prediction.category,
    }));
    setChartData(chartData);
    setShowResults(true);
    
    // Scroll to results section after setting the state
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const barChartData = {
    labels: ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Australia'],
    datasets: [
      {
        label: 'Affected Cropland (%)',
        data: [25, 30, 20, 45, 40, 15],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const pieChartData = {
    labels: ['At Risk', 'Food Secure'],
    datasets: [
      {
        data: [820, 6380],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <a className="mr-6 mx-4 flex items-center space-x-2" href="#" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <Leaf className="h-6 w-6" />
            <span className="text-lg font-extrabold">EcoShield</span>
          </a>
          <nav className="hidden md:flex mx-4 items-center space-x-6 text-sm font-medium">
            <NavLink href="#home" section="home">Home</NavLink>
            <NavLink href="#impact" section="impact">Our Impact</NavLink>
            <NavLink href="#predict" section="predict">Predict Yield</NavLink>
            <NavLink href="#about" section="about">About</NavLink>
            <NavLink href="#contact" section="contact">Contact</NavLink>
          </nav>
          <div className="md:hidden ml-auto">
            <Button onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <Button className="hidden md:inline-flex mx-4 items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ml-auto">
            Dashboard
          </Button>
        </div>
        {menuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <NavLink href="#home" section="home">Home</NavLink>
              <NavLink href="#impact" section="impact">Our Impact</NavLink>
              <NavLink href="#predict" section="predict">Predict Yield</NavLink>
              <NavLink href="#about" section="about">About</NavLink>
              <NavLink href="#contact" section="contact">Contact</NavLink>
            </nav>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 w-64 p-6">
            <nav className="flex flex-col space-y-4">
              <NavLink href="#home" section="home">Home</NavLink>
              <NavLink href="#impact" section="impact">Our Impact</NavLink>
              <NavLink href="#predict" section="predict">Predict Yield</NavLink>
              <NavLink href="#about" section="about">About</NavLink>
              <NavLink href="#contact" section="contact">Contact</NavLink>
            </nav>
          </div>
          <div className="absolute inset-0" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1">
        <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Protecting Our Planet's Food Security
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    EcoShield is at the forefront of combating climate change's impact on global food systems.
                    We use cutting-edge data science and big data processing to analyze climate patterns and their effects on food production and availability.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={() => scrollToSection('about')} className="inline-flex items-center justify-center">
                    Learn More
                  </Button>
                  <Button onClick={() => scrollToSection('contact')} variant="outline" className="inline-flex items-center justify-center">
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="EcoShield Hero Image"
                  className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
                  height="400"
                  src="/images/main.jpg"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Our Impact</h2>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Global Temperature Rise</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+1.5°C</div>
                  <p className="text-xs text-muted-foreground">Since pre-industrial levels</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Affected Cropland</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">37%</div>
                  <p className="text-xs text-muted-foreground">Of global agricultural land</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Food Insecurity Risk</CardTitle>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">820M</div>
                  <p className="text-xs text-muted-foreground">People at risk globally</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Affected Cropland by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Global Food Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="predict" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Predict Crop Yield</h2>
            <div className="max-w-lg mx-auto bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="Area">Area</Label>
                  <Input
                    id="Area"
                    type="text"
                    value={formData.Area}
                    onChange={(e) => setFormData({ ...formData, Area: e.target.value })}
                    placeholder="Enter area"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Item">Item</Label>
                  <Input
                    id="Item"
                    type="text"
                    value={formData.Item}
                    onChange={(e) => setFormData({ ...formData, Item: e.target.value })}
                    placeholder="Enter item (e.g., crop)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Year">Year</Label>
                  <Input
                    id="Year"
                    type="number"
                    value={formData.Year}
                    onChange={(e) => setFormData({ ...formData, Year: e.target.value })}
                    placeholder="Enter year"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rainfall">Average Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    value={formData.average_rain_fall_mm_per_year}
                    onChange={(e) => setFormData({ ...formData, average_rain_fall_mm_per_year: e.target.value })}
                    placeholder="Enter average rainfall"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pesticides">Pesticides (Tonnes)</Label>
                  <Input
                    id="pesticides"
                    type="number"
                    value={formData.pesticides_tonnes}
                    onChange={(e) => setFormData({ ...formData, pesticides_tonnes: e.target.value })}
                    placeholder="Enter pesticides in tonnes"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Average Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.avg_temp}
                    onChange={(e) => setFormData({ ...formData, avg_temp: e.target.value })}
                    placeholder="Enter average temperature"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Predict Yield
                </Button>
              </form>
            </div>
          </div>
        </section>

        {showResults && (
          <section id="results" ref={resultsRef} className="w-full py-12 md:py-24 lg:py-32 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Yield Results</h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  {Object.entries(yieldResult).map(([model, prediction]) => (
                    <Card key={model}>
                      <CardHeader>
                        <CardTitle>{model}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{parseFloat(prediction.yield).toFixed(2)} hg/ha</p>
                        <p className="text-sm text-gray-500">Category: {prediction.category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Yield Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Bar
  data={{
    labels: chartData.map(item => item.model),
    datasets: [
      {
        label: 'Predicted Yield (hg/ha)',
        data: chartData.map(item => item.yield),
        backgroundColor: chartData.map(item => {
          if (item.category === 'Low') return 'rgba(255, 0, 0, 0.6)';  // Red for low
          if (item.category === 'Medium') return 'rgba(255, 165, 0, 0.6)'; // Orange for medium
          if (item.category === 'High') return 'rgb(0,128,0,0.6)';   // Green for high
          return 'rgba(135, 206, 235, 0.6)'; // Default color if category is unknown
        }),
        borderColor: chartData.map(item => {
          if (item.category === 'Low') return 'rgba(255, 99, 132, 1)';
          if (item.category === 'Medium') return 'rgba(255, 159, 64, 1)';
          if (item.category === 'High') return 'rgba(75, 192, 192, 1)';
          return 'rgba(135, 206, 235, 1)'; // Default border color
        }),
        borderWidth: 1,
      },
    ],
  }}
  options={{
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Yield (hg/ha)',
        },
      },
    },
  }}
/>

                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">About EcoShield</h2>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-gray-500 dark:text-gray-400">
                  EcoShield was founded in 2024 with a mission to address the growing challenges of climate change on global food security. Our team of data scientists, climate experts, and agricultural specialists work tirelessly to provide actionable insights and solutions.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  We believe that by harnessing the power of big data and advanced analytics, we can help mitigate the impact of climate change on food production and distribution, ensuring a sustainable future for generations to come.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Our Core Values</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-500 dark:text-gray-400">
                  <li>Innovation in climate data analysis</li>
                  <li>Commitment to global food security</li>
                  <li>Collaboration with governments and organizations</li>
                  <li>Transparency in our methodologies and findings</li>
                  <li>Continuous learning and adaptation</li>
                </ul>
              </div>
            </div>
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Our Approach</h3>
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We gather climate and agricultural data from various sources worldwide, including satellite imagery, weather stations, and field reports.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis & Modeling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Our team uses advanced machine learning algorithms to analyze data and create predictive models for climate change impacts.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Solution Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We work with partners to develop and implement strategies for sustainable agriculture and food distribution in affected regions.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="h-screen flex items-center justify-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Contact Us</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  We're here to answer any questions you may have about EcoShield and our work. Feel free to reach out to us using the contact information below.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>info@ecoshield.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>123 Eco Street, Green City, EC 12345</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="EcoShield Contact Image"
                  className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
                  height="350"
                  src="/images/Contact.png"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 EcoShield. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}