import { AnimatedSection } from "./animated-section";
import { ProductDiagram } from "./product-diagram";

const solutions = [
  {
    title: "Hire an AI HR Manager",
    description:
      "Automate HR processes, from onboarding to compliance, with an AI agent that ensures consistency and efficiency. Your AI HR Manager handles employee queries, manages documentation, and provides instant support, freeing up your human HR team for strategic initiatives.",
    Component: ProductDiagram,
  },
];

export function SolutionsSection() {
  const solution = solutions[0];
  return (
    <section
      id="solutions-section"
      className="w-full py-20 md:py-32 flex flex-col items-center gap-16 md:gap-24"
    >
      <AnimatedSection
        key={solution.title}
        className="w-full max-w-6xl mx-auto px-4 md:px-8"
      >
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center`}>
          <div className={`space-y-4 text-center md:text-left`}>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {solution.title}
            </h2>
            <p className="text-muted-foreground md:text-lg">
              {solution.description}
            </p>
          </div>
          <div className={`bg-card flex items-center justify-center`}>
            <ProductDiagram />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}