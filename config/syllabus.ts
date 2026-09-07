export type ChapterConfig = {
  name: string;
  description: string;
};

export type SubjectSyllabus = {
  [subjectSlug: string]: ChapterConfig[];
};

export type SyllabusConfig = {
  [courseSlug: string]: SubjectSyllabus;
};

const chapters = (
  items: Array<[string, string]>
): ChapterConfig[] =>
  items.map(([name, description]) => ({ name, description }));

export const SYLLABUS: SyllabusConfig = {

  "jee-main": {

    physics: chapters([
      ["Units and Measurements", "Units, dimensions, errors and significant figures"],
      ["Kinematics", "Motion in one and two dimensions"],
      ["Laws of Motion", "Newton laws, friction and dynamics"],
      ["Work Energy and Power", "Work, kinetic energy, potential energy and power"],
      ["System of Particles and Rotational Motion", "Centre of mass, torque and rotational dynamics"],
      ["Gravitation", "Universal gravitation and planetary motion"],
      ["Properties of Bulk Matter", "Solids, fluids and elasticity"],
      ["Thermodynamics", "Heat, work and laws of thermodynamics"],
      ["Kinetic Theory", "Molecular theory of gases"],
      ["Oscillations and Waves", "SHM, wave motion and sound"],
      ["Electrostatics", "Electric charges, fields and potential"],
      ["Current Electricity", "Electric current, resistance and circuits"],
      ["Magnetic Effects of Current", "Magnetic fields and electromagnetic forces"],
      ["Electromagnetic Induction and AC", "Induction, alternating current and transformers"],
      ["Electromagnetic Waves", "Properties and spectrum of electromagnetic waves"],
      ["Optics", "Ray optics, wave optics and optical instruments"],
      ["Dual Nature of Matter and Radiation", "Photoelectric effect and matter waves"],
      ["Atoms and Nuclei", "Atomic models, nuclear physics and radioactivity"],
      ["Semiconductor Electronics", "Semiconductors, diodes and digital electronics"],
    ]),

    chemistry: chapters([
      ["Some Basic Concepts of Chemistry", "Mole concept and stoichiometry"],
      ["Atomic Structure", "Atomic models and electronic configuration"],
      ["Chemical Bonding", "Chemical bonds and molecular structure"],
      ["States of Matter", "Gases, liquids and solids"],
      ["Thermodynamics", "Chemical thermodynamics and energetics"],
      ["Equilibrium", "Chemical and ionic equilibrium"],
      ["Redox Reactions", "Oxidation and reduction reactions"],
      ["Solutions", "Concentration and colligative properties"],
      ["Electrochemistry", "Electrochemical cells and electrolysis"],
      ["Chemical Kinetics", "Rate of reaction and reaction mechanisms"],
      ["Periodic Classification", "Periodic table and periodic properties"],
      ["p Block Elements", "Properties of p block elements"],
      ["d and f Block Elements", "Transition and inner transition elements"],
      ["Coordination Compounds", "Coordination chemistry"],
      ["Organic Chemistry Basics", "Nomenclature and organic reaction fundamentals"],
      ["Hydrocarbons", "Alkanes, alkenes and alkynes"],
      ["Haloalkanes and Haloarenes", "Halogen containing organic compounds"],
      ["Alcohols Phenols and Ethers", "Oxygen containing organic compounds"],
      ["Aldehydes Ketones and Carboxylic Acids", "Carbonyl compounds"],
      ["Amines", "Nitrogen containing organic compounds"],
      ["Biomolecules", "Carbohydrates, proteins and nucleic acids"],
      ["Polymers", "Natural and synthetic polymers"],
      ["Chemistry in Everyday Life", "Applications of chemistry"],
    ]),

    mathematics: chapters([
      ["Sets Relations and Functions", "Sets, relations and functions"],
      ["Complex Numbers", "Complex number system and applications"],
      ["Quadratic Equations", "Roots and properties of quadratic equations"],
      ["Matrices and Determinants", "Matrices, determinants and applications"],
      ["Permutations and Combinations", "Counting principles"],
      ["Mathematical Induction", "Principle of mathematical induction"],
      ["Binomial Theorem", "Expansion and properties"],
      ["Sequences and Series", "Arithmetic and geometric progressions"],
      ["Limit Continuity and Differentiability", "Foundations of calculus"],
      ["Differential Calculus", "Derivatives and applications"],
      ["Integral Calculus", "Indefinite and definite integration"],
      ["Differential Equations", "First order differential equations"],
      ["Coordinate Geometry", "Lines, circles and conic sections"],
      ["Three Dimensional Geometry", "Geometry in three dimensions"],
      ["Vector Algebra", "Vectors and vector operations"],
      ["Probability", "Probability theory and distributions"],
      ["Statistics", "Statistical measures and analysis"],
      ["Trigonometry", "Trigonometric identities and equations"],
    ]),
  },


  "jee-advanced": {

    physics: chapters([
      ["Mechanics", "Advanced mechanics including kinematics and dynamics"],
      ["Rigid Body Dynamics", "Rotational motion and rigid body mechanics"],
      ["Fluid Mechanics", "Fluid statics and dynamics"],
      ["Oscillations", "Simple harmonic motion and oscillatory systems"],
      ["Waves", "Mechanical waves and wave phenomena"],
      ["Thermal Physics", "Thermodynamics and kinetic theory"],
      ["Electrostatics", "Advanced electrostatics and capacitors"],
      ["Current Electricity", "Electrical circuits and networks"],
      ["Magnetism", "Magnetic fields and magnetic materials"],
      ["Electromagnetic Induction", "Faraday law and induction"],
      ["Alternating Current", "AC circuits and resonance"],
      ["Optics", "Geometrical and wave optics"],
      ["Modern Physics", "Quantum physics, atoms and nuclei"],
    ]),

    chemistry: chapters([
      ["Physical Chemistry Fundamentals", "Mole concept and atomic structure"],
      ["Chemical Thermodynamics", "Energetics and spontaneity"],
      ["Chemical Equilibrium", "Equilibrium systems"],
      ["Electrochemistry", "Electrochemical principles"],
      ["Chemical Kinetics", "Reaction rates"],
      ["Organic Chemistry Fundamentals", "Mechanisms and stereochemistry"],
      ["Hydrocarbons", "Organic hydrocarbon chemistry"],
      ["Carbonyl Compounds", "Aldehydes and ketones"],
      ["Amines and Biomolecules", "Nitrogen compounds and biological molecules"],
      ["Inorganic Chemistry", "Periodic and coordination chemistry"],
      ["Transition Elements", "d and f block chemistry"],
      ["Coordination Chemistry", "Complex compounds"],
    ]),

    mathematics: chapters([
      ["Algebra", "Advanced algebraic concepts"],
      ["Complex Numbers", "Complex plane and transformations"],
      ["Matrices", "Matrix algebra"],
      ["Probability", "Advanced probability"],
      ["Calculus", "Differential and integral calculus"],
      ["Differential Equations", "Mathematical differential equations"],
      ["Coordinate Geometry", "Analytical geometry"],
      ["Vectors", "Vector algebra"],
      ["Three Dimensional Geometry", "Spatial geometry"],
      ["Trigonometry", "Advanced trigonometric concepts"],
    ]),
  },


  "gate-cse": {

    "engineering-mathematics": chapters([
      ["Discrete Mathematics", "Logic, sets, relations and combinatorics"],
      ["Linear Algebra", "Matrices, vector spaces and eigenvalues"],
      ["Calculus", "Differentiation and integration"],
      ["Probability", "Probability and random variables"],
      ["Numerical Methods", "Numerical computation techniques"],
    ]),

    "digital-logic": chapters([
      ["Boolean Algebra", "Boolean laws and simplification"],
      ["Combinational Circuits", "Logic gates and combinational design"],
      ["Sequential Circuits", "Flip flops and sequential logic"],
      ["Number Systems", "Binary, octal and hexadecimal systems"],
    ]),

    "computer-organization": chapters([
      ["Computer Architecture", "CPU organization and instruction execution"],
      ["Memory Organization", "Memory hierarchy and cache"],
      ["Instruction Pipelines", "Pipeline processing"],
      ["Input Output Organization", "I/O systems and interrupts"],
    ]),

    "programming-data-structures": chapters([
      ["Programming Fundamentals", "Programming concepts and complexity"],
      ["Arrays and Linked Lists", "Linear data structures"],
      ["Stacks and Queues", "Stack and queue implementations"],
      ["Trees", "Tree data structures"],
      ["Graphs", "Graph algorithms and representations"],
      ["Hashing", "Hash tables and hashing techniques"],
    ]),

    algorithms: chapters([
      ["Algorithm Analysis", "Time and space complexity"],
      ["Sorting and Searching", "Fundamental algorithms"],
      ["Divide and Conquer", "Divide and conquer algorithms"],
      ["Dynamic Programming", "Optimization using subproblems"],
      ["Greedy Algorithms", "Greedy strategy"],
      ["Graph Algorithms", "Traversal and shortest path algorithms"],
    ]),

    "theory-of-computation": chapters([
      ["Finite Automata", "Regular languages and automata"],
      ["Context Free Grammars", "Grammar and parsing"],
      ["Turing Machines", "Computation models"],
      ["Computability", "Decidability and complexity"],
    ]),

    compilers: chapters([
      ["Lexical Analysis", "Tokenization and lexical analysis"],
      ["Syntax Analysis", "Parsing techniques"],
      ["Semantic Analysis", "Type checking"],
      ["Code Generation", "Intermediate and target code generation"],
    ]),

    "operating-systems": chapters([
      ["Processes and Threads", "Process management"],
      ["CPU Scheduling", "Scheduling algorithms"],
      ["Deadlocks", "Deadlock prevention and avoidance"],
      ["Memory Management", "Paging and segmentation"],
      ["File Systems", "File organization"],
    ]),

    databases: chapters([
      ["Relational Model", "Relational database fundamentals"],
      ["SQL", "Structured query language"],
      ["Normalization", "Database normalization"],
      ["Transactions", "Concurrency and recovery"],
      ["Indexing", "Database indexing"],
    ]),

    "computer-networks": chapters([
      ["Network Layers", "OSI and TCP IP models"],
      ["Data Link Layer", "Framing and error detection"],
      ["Network Layer", "Routing and IP"],
      ["Transport Layer", "TCP and UDP"],
      ["Application Layer", "Network applications"],
    ]),
  },


  upsc: {

    history: chapters([
      ["Ancient India", "Ancient Indian history and civilization"],
      ["Medieval India", "Medieval Indian history"],
      ["Modern India", "Freedom struggle and modern history"],
      ["Indian Art and Culture", "Indian cultural heritage"],
      ["World History", "Major global historical developments"],
    ]),

    geography: chapters([
      ["Physical Geography", "Earth structure and physical processes"],
      ["Indian Geography", "Indian physical and economic geography"],
      ["World Geography", "Global geographical concepts"],
      ["Environment Geography", "Environmental geographical systems"],
    ]),

    polity: chapters([
      ["Constitution of India", "Constitutional framework"],
      ["Fundamental Rights", "Rights and duties"],
      ["Parliament", "Legislature and parliamentary system"],
      ["Judiciary", "Indian judicial system"],
      ["Federalism", "Centre state relations"],
      ["Governance", "Public administration and governance"],
    ]),

    economy: chapters([
      ["Indian Economy Basics", "Economic fundamentals"],
      ["Economic Planning", "Planning and development"],
      ["Banking and Finance", "Indian financial system"],
      ["Budget and Fiscal Policy", "Government finances"],
      ["International Economy", "Global economic relations"],
    ]),

    environment: chapters([
      ["Ecology", "Ecosystems and ecological principles"],
      ["Biodiversity", "Biodiversity and conservation"],
      ["Climate Change", "Climate systems and global warming"],
      ["Environmental Laws", "Indian environmental legislation"],
    ]),

    "science-technology": chapters([
      ["Space Technology", "Indian space programme"],
      ["Biotechnology", "Biological technologies"],
      ["Information Technology", "Digital technologies"],
      ["Defence Technology", "Indian defence technology"],
    ]),

    ethics: chapters([
      ["Ethics and Human Values", "Ethical foundations"],
      ["Attitude", "Attitude and behaviour"],
      ["Emotional Intelligence", "Emotional intelligence in administration"],
      ["Public Service Values", "Ethics in public administration"],
    ]),
  },


  "ssc-cgl": {

    "general-intelligence": chapters([
      ["Analogies", "Verbal and non verbal analogies"],
      ["Classification", "Classification reasoning"],
      ["Series", "Number and alphabet series"],
      ["Coding and Decoding", "Coding reasoning"],
      ["Blood Relations", "Relationship reasoning"],
      ["Direction Sense", "Direction based reasoning"],
      ["Syllogism", "Logical reasoning"],
      ["Venn Diagrams", "Set based reasoning"],
    ]),

    "general-awareness": chapters([
      ["Indian History", "Historical awareness"],
      ["Indian Geography", "Geographical awareness"],
      ["Indian Polity", "Constitution and government"],
      ["Indian Economy", "Economic awareness"],
      ["General Science", "Physics chemistry and biology"],
      ["Current Affairs", "National and international events"],
    ]),

    "quantitative-aptitude": chapters([
      ["Number System", "Numbers and operations"],
      ["Percentage", "Percentage calculations"],
      ["Profit and Loss", "Commercial mathematics"],
      ["Ratio and Proportion", "Ratios and proportions"],
      ["Time and Work", "Work based problems"],
      ["Time Speed and Distance", "Motion based calculations"],
      ["Algebra", "Basic algebra"],
      ["Geometry", "Geometrical concepts"],
      ["Mensuration", "Areas and volumes"],
      ["Data Interpretation", "Charts and tables"],
    ]),

    english: chapters([
      ["Grammar Fundamentals", "English grammar"],
      ["Vocabulary", "Words and meanings"],
      ["Sentence Improvement", "Grammar correction"],
      ["Error Spotting", "Identify grammatical errors"],
      ["Reading Comprehension", "Passage comprehension"],
      ["Cloze Test", "Context based vocabulary"],
    ]),
  },


  cat: {

    "quantitative-ability": chapters([
      ["Arithmetic", "Percentages, ratios, averages and interest"],
      ["Algebra", "Equations and inequalities"],
      ["Geometry", "Geometry and mensuration"],
      ["Number Systems", "Properties of numbers"],
      ["Modern Mathematics", "Permutations probability and combinations"],
    ]),

    varc: chapters([
      ["Reading Comprehension", "CAT reading comprehension strategies"],
      ["Para Jumbles", "Sentence arrangement"],
      ["Para Summary", "Paragraph summarization"],
      ["Odd Sentence Out", "Logical sentence identification"],
      ["Vocabulary and Grammar", "Language fundamentals"],
    ]),

    dilr: chapters([
      ["Data Interpretation Basics", "Tables charts and graphs"],
      ["Logical Reasoning Fundamentals", "Logical problem solving"],
      ["Arrangements", "Seating and arrangement puzzles"],
      ["Games and Tournaments", "Tournament based reasoning"],
      ["Sets and Venn Diagrams", "Set based data interpretation"],
    ]),
  },
};
