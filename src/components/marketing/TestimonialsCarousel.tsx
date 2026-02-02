import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ryan Nakamura",
    role: "CTO",
    company: "Fintech Labs",
    content: "HeftCoder's orchestration mode is unreal. We shipped a complete dashboard in 2 hours that would've taken our team 2 weeks.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Sofia Andersson",
    role: "Founder",
    company: "NovaTech",
    content: "Finally, an AI tool that actually understands architecture. The multi-agent system feels like having a senior dev team on demand.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Benjamin Torres",
    role: "Lead Engineer",
    company: "CloudScale",
    content: "The Command Center mode is terrifying in the best way. Agents running while I sleep, deploying fixes before I wake up.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Aisha Okonkwo",
    role: "VP Engineering",
    company: "Quantum AI",
    content: "We replaced three separate tools with HeftCoder. The cost savings alone paid for the entire team's subscription.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lucas Fernandez",
    role: "Solo Founder",
    company: "LaunchPad",
    content: "From idea to MVP in a weekend. I'm not exaggerating. HeftCoder turned me into a 10x developer overnight.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Mei Lin Zhang",
    role: "Tech Lead",
    company: "DataForge",
    content: "The smart model routing is genius. It knows when to use the cheap models and when to bring out the heavy artillery.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
  }
];

export function TestimonialsCarousel() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Trusted by Builders
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto px-2">
          Join thousands of developers who've transformed how they build.
        </p>
      </div>

      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 sm:gap-6"
          animate={{
            x: isPaused ? undefined : [0, -50 * testimonials.length * 6],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ width: "max-content" }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${index}`}
              className="w-[280px] sm:w-[350px] flex-shrink-0 bg-[#111] border border-white/10 rounded-2xl p-4 sm:p-6 group cursor-pointer transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)]"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-orange-500 transition-colors"
                  />
                  <div className="absolute inset-0 rounded-full bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
