import AiCodeReviews from "./bento/ai-code-reviews"
import RealtimeCodingPreviews from "./bento/real-time-previews"
import OneClickIntegrationsIllustration from "./bento/one-click-integrations-illustration"
import MCPConnectivityIllustration from "./bento/mcp-connectivity-illustration"
import EasyDeployment from "./bento/easy-deployment"
import ParallelCodingAgents from "./bento/parallel-agents"
import { AnimatedSection } from "./animated-section"

const solutions = [
    {
        title: "Hire an AI HR Manager",
        description: "Automate HR processes, from onboarding to compliance, with an AI agent that ensures consistency and efficiency. Your AI HR Manager handles employee queries, manages documentation, and provides instant support, freeing up your human HR team for strategic initiatives.",
        Component: AiCodeReviews,
    },
    {
        title: "Hire an AI Marketing Strategist",
        description: "Leverage AI to generate innovative marketing campaigns, analyze market trends, and create compelling content. This agent acts as your creative partner, delivering data-driven strategies to boost engagement and drive growth.",
        Component: RealtimeCodingPreviews,
    },
    {
        title: "Hire an AI Sales Executive",
        description: "Empower your sales team with an AI agent that identifies leads, automates outreach, and provides real-time insights during customer interactions. Close deals faster and build stronger customer relationships with intelligent sales assistance.",
        Component: OneClickIntegrationsIllustration,
    },
    {
        title: "Hire an AI Agile Coach",
        description: "Optimize your project management with an AI Agile Coach. It facilitates sprint planning, tracks progress, identifies bottlenecks, and ensures your team adheres to agile principles, enhancing productivity and collaboration.",
        Component: MCPConnectivityIllustration,
    },
    {
        title: "Supercharge your workforce with intelligence assistance",
        description: "Deploy multiple AI agents that work in parallel to tackle complex challenges. From code refactoring to data analysis, these agents collaborate to deliver solutions faster than ever, dramatically increasing your team's output.",
        Component: ParallelCodingAgents,
    },
    {
        title: "Intelligence built for your workplace ecosystem",
        description: "Integrate a smart co-pilot into every task. Our AI seamlessly connects with your existing tools, providing contextual assistance and automating repetitive tasks across your entire workflow, making every employee more effective.",
        Component: EasyDeployment,
    },
]

export function SolutionsSection() {
    return (
        <section id="solutions-section" className="w-full py-20 md:py-32 flex flex-col items-center gap-16 md:gap-24">
            {solutions.map((solution, index) => (
                <AnimatedSection 
                    key={solution.title}
                    className="w-full max-w-6xl mx-auto px-4 md:px-8"
                >
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center`}>
                        <div className={`space-y-4 text-center md:text-left ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{solution.title}</h2>
                            <p className="text-muted-foreground md:text-lg">{solution.description}</p>
                        </div>
                        <div className={`h-80 rounded-2xl border bg-card p-4 flex items-center justify-center overflow-hidden ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                            <solution.Component />
                        </div>
                    </div>
                </AnimatedSection>
            ))}
        </section>
    )
}