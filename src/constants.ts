import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: 'foundations',
    title: 'Eng Foundations',
    description: 'Master logic, discrete math, and the mathematical roots of computing.',
    lessons: [
      {
        id: 'logic-101',
        title: 'Propositional Logic',
        category: 'Foundations',
        description: 'Understand truth tables, logical operators, and proofs.',
        content: '# Propositional Logic\n\nLogic is the foundation of digital circuit design and programming languages. In this lesson, we explore:\n\n- AND, OR, NOT operations\n- Implication: If P then Q\n- Truth Tables: Systematic ways to evaluate logic expressions.'
      },
      {
        id: 'logic-gates',
        title: 'Logic Gates',
        category: 'Foundations',
        description: 'The physical implementation of logic in hardware.',
        content: '# Logic Gates\n\nLogic gates are the building blocks of digital systems. \n\n- **AND Gate**: Output is true only if all inputs are true.\n- **OR Gate**: Output is true if at least one input is true.\n- **NOT Gate**: Inverts the input.\n- **XOR Gate**: True if inputs are different.\n\n### Application in Engineering\nModern CPUs use billions of these gates to perform complex arithmetic and logical operations.'
      }
    ]
  },
  {
    id: 'design',
    title: 'System Design',
    description: 'Scale from monolithic scripts to distributed global systems.',
    lessons: [
      {
        id: 'schema-design',
        title: 'Schema Design',
        category: 'System Design',
        description: 'Modeling data for consistency vs. availability.',
        content: '# Schema Design\n\n### Relational (SQL)\n- **Normalization**: Reducing redundancy.\n- **ACID**: Atomicity, Consistency, Isolation, Durability.\n\n### Non-Relational (NoSQL)\n- **Denormalization**: Optimized for read speed.\n- **BASE**: Basically Available, Soft state, Eventual consistency.'
      },
      {
        id: 'distributed-systems',
        title: 'Distributed',
        category: 'System Design',
        description: 'Lessons on CAP theorem, network partitions, and horizontal scaling.',
        content: '# Distributed Systems Engineering\n\nWhen a single machine can no longer handle the load or provides a single point of failure, we transition to distributed systems.\n\n### Core Concepts\n\n1. **The CAP Theorem**: In the presence of a network partition (P), you must choose between Consistency (C) and Availability (A).\n2. **Load Balancing**: Strategies for distributing requests (Round Robin, Least Connections, IP Hash).\n3. **Eventual Consistency**: Understanding that in highly available systems, data might be stale for a brief window.\n4. **Service Discovery**: Using systems like Consul or Etcd to track service health and location.'
      },
      {
        id: 'workflow-tdd',
        title: 'TDD Protocols',
        category: 'Workflow',
        description: 'Advanced testing strategies for mission-critical systems.',
        content: '# TDD Protocols\n\nTest-Driven Development is a strict protocol for engineering reliability.\n\n- **Unit Testing**: Testing individual components in isolation.\n- **Integration Testing**: Testing how modules interact.\n- **Mocking**: Simulating external dependencies (APIs, Databases).\n- **Code Coverage**: Measuring the paths exercised by tests.'
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Architecture Lab',
    description: 'When to decouple and why complexity explodes.',
    lessons: [
      {
        id: 'mono-vs-micro',
        title: 'Monoliths vs. Microservices',
        category: 'Architecture',
        description: 'When to decouple and why complexity explodes.',
        content: '# Architecture Patterns\n\nChoosing between a monolith and microservices depends on the team size and scaling needs.'
      },
      {
        id: 'solid-principles',
        title: 'SOLID Design',
        category: 'Principles',
        description: 'Five principles to make code maintainable.',
        content: '# SOLID Principles\n\n1. **S**ingle Responsibility\n2. **O**pen/Closed\n3. **L**iskov Substitution\n4. **I**nterface Segregation\n5. **D**ependency Inversion'
      }
    ]
  },
  {
    id: 'grind-workflow',
    title: 'The Grind',
    description: 'Master the SDLC: Requirements, TDD, and CI/CD pipelines.',
    lessons: [
      {
        id: 'tdd-protocols',
        title: 'TDD Protocols & Best Practices',
        category: 'Workflow',
        description: 'Advanced testing strategies for mission-critical systems.',
        content: '# TDD Protocols\n\nTest-Driven Development is a strict protocol for engineering reliability.\n\n- **Unit Testing**: Testing individual components in isolation.\n- **Integration Testing**: Testing how modules interact.\n- **Mocking**: Simulating external dependencies (APIs, Databases).\n- **Code Coverage**: Measuring the paths exercised by tests.'
      },
      {
        id: 'reqs-analysis',
        title: 'Requirement Engineering',
        category: 'Analysis',
        description: 'How to translate vague ideas into strict specifications.',
        content: '# Requirement Engineering\n\n- **Functional Requirements**: What the system does.\n- **Non-functional Requirements**: How the system performs (latency, availability).\n- **User Stories**: Capturing the "Who, What, Why".'
      },
      {
        id: 'tdd-cycle',
        title: 'The TDD Red-Green Cycle',
        category: 'Testing',
        description: 'Write tests before code to force better design.',
        content: '# Test Driven Development\n\n1. **Red**: Write a failing test.\n2. **Green**: Write the minimum code to pass.\n3. **Refactor**: Clean up the logic while keeping the test green.'
      },
      {
        id: 'cicd-automations',
        title: 'CI/CD Pipelines',
        category: 'DevOps',
        description: 'Automate quality with continuous integration and delivery.',
        content: '# CI/CD Pipelines\n\nModern engineering relies on automation to ensure that no code reaches production without being verified.\n\n- **Continuous Integration**: Regularly merging code into a shared repository and running automated tests.\n- **Continuous Delivery**: Automatically preparing code for release to production.\n- **Deployment Strategies**: Blue-Green, Canary, and Rolling updates.'
      }
    ]
  },
  {
    id: 'pro-skills',
    title: 'Elite Skills',
    description: 'Merge requests, documentation, and the art of engineering communication.',
    lessons: [
      {
        id: 'git-philosophy',
        title: 'Git: The Source of Truth',
        category: 'VCS',
        description: 'Atomic commits, rebasing, and branching strategies.',
        content: '# Version Control\n\n- **Branching**: Feature branches vs. Trunk-based development.\n- **Commits**: Clear messages that explain *why*, not *what*.'
      }
    ]
  }
];

export const INITIAL_SANDBOX: Record<string, any> = {
  'main.js': {
    name: 'main.js',
    language: 'javascript',
    content: '// Welcome to the Sandbox\nconsole.log("Grindingly system online...");\n\nfunction calculateScalability(users) {\n  return users * 1.5;\n}'
  },
  'api.js': {
    name: 'api.js',
    language: 'javascript',
    content: 'export async function fetchData() {\n  const res = await fetch("/api/data");\n  return res.json();\n}'
  },
  'style.css': {
    name: 'style.css',
    language: 'css',
    content: 'body {\n  background: #000;\n  color: #0f0;\n  font-family: "JetBrains Mono", monospace;\n}'
  },
  'README.md': {
    name: 'README.md',
    language: 'markdown',
    content: '# Project Alpha\n\nThis is a sandbox project designed to test architectural integrity.'
  }
};

export const REVIEW_CHALLENGES = [
  {
    id: 'god-function',
    title: 'The God Function',
    language: 'javascript',
    principles: ['Single Responsibility', 'DRY'],
    badCode: `function handleUser(user) {
  if (user.age > 18) {
    console.log("Adult");
    db.save(user);
    email.sendWelcome(user);
    log.info("Saved user");
    return true;
  } else {
    return false;
  }
}`
  },
  {
    id: 'spaghetti-logic',
    title: 'Nested Spaghetti',
    language: 'javascript',
    principles: ['Readable', 'Clean Code'],
    badCode: `function check(data) {
  if (data) {
    if (data.items) {
      if (data.items.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
          if (data.items[i].valid) {
            console.log(data.items[i].name);
          }
        }
      }
    }
  }
}`
  }
];
