"use client"
import React, { useRef } from 'react';
import { SearchNormal1, Link as LinkIcon } from 'iconsax-react';
import { motion, useInView } from 'framer-motion';

interface ArticleExcerpt {
    content: string;
    source: {
        name: string;
        logo?: string;
        url: string;
    };
    year: string;
}

const articleExcerpts: ArticleExcerpt[] = [
    {
        content: "Students often adopt learning strategies that are suboptimal for memory retention, as reading multiple times the to-be-learned materials, for example. A more effective approach consists in trying to remember the materials after studying them, a strategy known as 'retrieval practice.'",
        source: {
            name: "APA PsycNet",
            url: "https://psycnet.apa.org/record/2023-11530-015"
        },
        year: "2023"
    },
    {
        content: "Over a century of memory research demonstrates that active retrieval of information from memory is more advantageous for long-term learning than mere repetition.",
        source: {
            name: "ScienceDirect",
            logo: "https://sdfestaticassets-eu-west-1.sciencedirectassets.com/shared-assets/24/images/elsevier-non-solus-new-grey.svg",
            url: "https://www.sciencedirect.com/science/article/abs/pii/S0959475222001001"
        },
        year: "2018"
    },
    {
        content: "Unsurprisingly, the news is good: retrieval practice was consistently found to be better than restudy (the most typical control condition), and much better when the control condition involved either no activity or an unrelated filler activity.",
        source: {
            name: "The Learning Scientists",
            logo: "https://images.squarespace-cdn.com/content/v1/56acc1138a65e2a286012c54/1470608245014-RQ5MLKUUW2AZC39MVMHP/LS+colour+Hex+green+thick.png?format=1500w",
            url: "https://www.learningscientists.org/blog/2017/2/9-1"
        },
        year: "2017"
    },
    {
        content: "Taking a test can enhance students' ability to learn new information later. Here, we provide a theoretical and quantitative synthesis of this literature. Our results show that testing enhances correct recall associated with new learning and reduces incorrect intrusions.",
        source: {
            name: "ResearchGate",
            logo: "https://c5.rgstatic.net/m/419438641133902/images/icons/svgicons/new-index-logo.svg",
            url: "https://www.researchgate.net/publication/326719065_Retrieval_Potentiates_New_Learning_A_Theoretical_and_Meta-Analytic_Review"
        },
        year: "2013"
    },
    {
        content: "Recent meta-analytic reviews have demonstrated that active learning methods reduce the achievement gap between academic success and failure. One form of active learning is retrieval practice, where the activity of including test sessions while acquiring new information has been shown to markedly boost long-term retention (i.e., commonly denoted as the testing-effect",
        source: {
            name: "PubMed Central",
            logo: "https://pmc.ncbi.nlm.nih.gov/static/img/pmc-logo.svg",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8866974"
        },
        year: "2022"
    },
    {
        content: "Retrieval practice is a powerful method for consolidating long-term learning.",
        source: {
            name: "National Library of Medicine (PubMed)",
            logo: "https://cdn.ncbi.nlm.nih.gov/pubmed/0d576970-ea4f-4f8d-9bab-bf51569c42d2/core/images/pubmed-logo-blue.svg",
            url: "https://pubmed.ncbi.nlm.nih.gov/39556402"
        },
        year: "2024"
    }
];

const GoogleSearchBar: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });

    const searchQuery = "retrieval practice learning effectiveness meta-analysis";
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    return (
        <div className="pt-12 md:pt-24 bg-black pb-12" ref={ref}>
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="py-12 md:py-24 !pb-0 w-[90%] md:w-[85%] lg:w-auto max-w-3xl mx-auto flex flex-col justify-center rounded-2xl bg-white/10 backdrop-blur-lg"
            >
                <div className="w-full px-4 sm:px-8 md:px-16">
                    <div className="flex justify-center mb-4">
                        <img
                            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                            alt="Google"
                            className="h-6 md:h-8 object-contain"
                        />
                    </div>
                    <div
                        onClick={() => window.open(googleSearchUrl, '_blank')}
                        className="flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-full border border-gray-300 hover:shadow-md cursor-pointer bg-white"
                    >
                        <SearchNormal1 className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-gray-800 flex-1 text-sm md:text-base truncate">
                            {searchQuery}
                        </span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 mt-2 px-4">
                        About 54.2 million results (0.23 seconds)
                    </div>
                </div>

                <div className="h-24 md:h-32 mt-8 md:mt-16 mx-8 md:mx-12 border bg-white/30 rounded-t-3xl"></div>
            </motion.div>
        </div>
    );
};

const ArticleReference: React.FC = () => {
    const headerRef = useRef(null);
    const gridRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-20%" });
    const isGridInView = useInView(gridRef, { once: true, margin: "-20%" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.97
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.4 }
            }
        }
    };

    const remainingArticles = [...articleExcerpts, ...articleExcerpts];

    return (
        <section className="bg-background" id='testinomials'>
            <GoogleSearchBar />
            <div className="py-24 px-4 max-w-7xl mx-auto">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 60 }}
                    animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                    transition={{
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1],
                        opacity: { duration: 0.6 }
                    }}
                    className="flex flex-col text-center w-full mb-20"
                >
                    <div className='mb-8'>
                        <h2 className="sm:text-5xl text-4xl font-extrabold">3451 articles say practice questions are the best way to learn</h2>
                    </div>
                    <p className="lg:w-2/3 mx-auto leading-relaxed font-normal">Even better than rereading or memorizing</p>
                </motion.div>

                <div className="relative max-h-[140vh] overflow-y-hidden">
                    <motion.div
                        ref={gridRef}
                        variants={containerVariants}
                        initial="hidden"
                        animate={isGridInView ? "visible" : "hidden"}
                        className='flex flex-col gap-6'
                    >
                        <div className='columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'>
                            {remainingArticles.map((article, index) => (
                                <motion.div
                                    key={`remaining-${index}`}
                                    variants={itemVariants}
                                    className='break-inside-avoid-column bg-white/5 backdrop-blur-lg border border-white/10 
                                             rounded-xl p-6 hover:border-white/20 transition-all hover:scale-[1.02] duration-300'
                                >
                                    <div className='text-lg leading-relaxed mb-6 text-gray-200'>
                                        "{article.content}"
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            {article.source.logo && (
                                                <img
                                                    src={article.source.logo}
                                                    alt={article.source.name}
                                                    className='w-8 h-8 object-contain'
                                                />
                                            )}
                                            <div>
                                                <p className='font-medium'>{article.source.name}</p>
                                                <p className='text-sm text-gray-400'>{article.year}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`${article.source.url}#:~:text=${encodeURIComponent(article.content)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='p-2 hover:bg-white/10 rounded-full transition-colors'
                                        >
                                            <LinkIcon size={20} className='text-gray-400' />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default ArticleReference;