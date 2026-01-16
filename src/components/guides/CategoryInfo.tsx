import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, BookOpen, Shield } from "lucide-react";

interface CategoryInfoProps {
  title: string;
  sections: {
    title: string;
    icon: React.ElementType;
    items: string[];
  }[];
  alaskaDangerNote: string;
}

const CategoryInfo = ({ title, sections, alaskaDangerNote }: CategoryInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-8 mb-12"
    >
      <h2 className="font-display text-2xl text-foreground mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-glacier mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Alaska Danger Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-accent/5 border border-accent/30 rounded-lg p-5"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">Why Expert Guidance Matters in Alaska</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{alaskaDangerNote}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-glacier">
              <Shield className="h-4 w-4" />
              <span>All our guides carry emergency communication equipment and first-aid training</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryInfo;
