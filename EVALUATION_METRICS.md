# Evaluation Metrics - Justice Bridge Backend

This document outlines comprehensive evaluation metrics for the Justice Bridge Node.js backend system. These metrics help assess the quality, performance, and effectiveness of the legal document simplification and RAG-based chat platform.

---

## Table of Contents
1. [Functional Metrics](#1-functional-metrics)
2. [Performance Metrics](#2-performance-metrics)
3. [AI/ML Quality Metrics](#3-aiml-quality-metrics)
4. [User Experience Metrics](#4-user-experience-metrics)
5. [Security & Reliability Metrics](#5-security--reliability-metrics)
6. [Data & Storage Metrics](#6-data--storage-metrics)
7. [API Health Metrics](#7-api-health-metrics)
8. [Business Metrics](#8-business-metrics)

---

## 1. Functional Metrics

### 1.1 Authentication System
| Metric | Target | Description |
|--------|--------|-------------|
| **Registration Success Rate** | ≥ 99% | Percentage of successful user registrations |
| **Login Success Rate** | ≥ 99.5% | Successful logins vs failed attempts (excluding invalid credentials) |
| **Token Validation Accuracy** | 100% | JWT tokens correctly validated |
| **Google OAuth Success Rate** | ≥ 98% | Successful Google authentication attempts |
| **Password Hash Time** | ≤ 500ms | Time to hash password with bcrypt |

### 1.2 Law Simplification Feature
| Metric | Target | Description |
|--------|--------|-------------|
| **Text Simplification Success Rate** | ≥ 95% | Successful simplifications for text input |
| **PDF Simplification Success Rate** | ≥ 90% | Successful simplifications for PDF input |
| **Document Guard Accuracy** | ≥ 95% | Correct identification of Indian law documents |
| **Save to DB Success Rate** | ≥ 99% | Simplifications successfully stored in MongoDB |
| **Average Simplification Completeness** | ≥ 90% | Output covers all key points from input |

### 1.3 Judgement Simplification Feature
| Metric | Target | Description |
|--------|--------|-------------|
| **Text Simplification Success Rate** | ≥ 95% | Successful simplifications for text input |
| **PDF Simplification Success Rate** | ≥ 90% | Successful simplifications for PDF input |
| **Document Guard Accuracy** | ≥ 95% | Correct identification of Indian judgement documents |
| **Save to DB Success Rate** | ≥ 99% | Judgements successfully stored in MongoDB |
| **Structural Accuracy** | ≥ 90% | Key judgement elements correctly identified |

### 1.4 RAG Chat System
| Metric | Target | Description |
|--------|--------|-------------|
| **Chat Response Success Rate** | ≥ 95% | Successful responses to user queries |
| **PDF Upload & Processing Success** | ≥ 90% | PDFs successfully uploaded and embedded |
| **Embedding Generation Success** | ≥ 99% | Text chunks successfully embedded |
| **Vector Search Accuracy** | ≥ 85% | Relevant chunks retrieved for queries |
| **Context Relevance Score** | ≥ 80% | Retrieved context is relevant to query |
| **Chat History Persistence** | ≥ 99% | Messages successfully saved to DB |

### 1.5 Dashboard & History
| Metric | Target | Description |
|--------|--------|-------------|
| **Stats Retrieval Success Rate** | ≥ 99.5% | User stats successfully retrieved |
| **History Pagination Accuracy** | 100% | Correct page/limit handling |
| **Like/Unlike Success Rate** | ≥ 99% | Successful like status updates |
| **Combined History Accuracy** | 100% | Correct merging of law/judgement entries |
| **Data Freshness** | ≤ 1 second | Time lag for stats updates |

---

## 2. Performance Metrics

### 2.1 Response Time (Latency)
| Metric | Target | Measurement Point |
|--------|--------|------------------|
| **Auth Endpoints** | ≤ 300ms | P95 response time |
| **Text Simplification** | ≤ 5 seconds | P95 response time (LLM call) |
| **PDF Simplification** | ≤ 15 seconds | P95 response time (extraction + LLM) |
| **Chat Response (no PDF)** | ≤ 5 seconds | P95 response time |
| **Chat Response (with PDF)** | ≤ 20 seconds | P95 response time (upload + embed + LLM) |
| **Dashboard Stats** | ≤ 500ms | P95 response time |
| **Dashboard History** | ≤ 1 second | P95 response time |
| **PDF Text Extraction** | ≤ 5 seconds | Per document |
| **Embedding Generation** | ≤ 2 seconds | Per 500-word chunk |

### 2.2 Throughput
| Metric | Target | Description |
|--------|--------|-------------|
| **Concurrent Users Supported** | ≥ 100 | Simultaneous active users |
| **Requests Per Second (RPS)** | ≥ 50 | Overall API throughput |
| **Simplifications Per Minute** | ≥ 30 | Combined law + judgement |
| **Chat Messages Per Minute** | ≥ 60 | RAG chat throughput |
| **File Uploads Per Minute** | ≥ 20 | PDF upload processing capacity |

### 2.3 Resource Utilization
| Metric | Target | Description |
|--------|--------|-------------|
| **CPU Utilization** | ≤ 80% | Average under normal load |
| **Memory Usage** | ≤ 2GB | Node.js process memory |
| **HNSW Index Memory** | ≤ 500MB | Per 10,000 chunks |
| **MongoDB Connection Pool** | ≤ 80% | Connection utilization |
| **Disk I/O Wait** | ≤ 10% | Time spent on disk operations |

### 2.4 Scalability
| Metric | Target | Description |
|--------|--------|-------------|
| **Horizontal Scale Factor** | ≥ 3x | Performance gain with 3x instances |
| **Database Query Time Growth** | ≤ log(n) | Query time vs data size |
| **Vector Search Time Growth** | ≤ log(n) | Search time vs index size |

---

## 3. AI/ML Quality Metrics

### 3.1 LLM Output Quality (Groq llama-3.1-8b-instant)
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Simplification Accuracy** | ≥ 85% | Manual review / user feedback |
| **Factual Correctness** | ≥ 95% | No hallucinations or incorrect legal info |
| **Language Simplification Score** | ≥ 80% | Flesch Reading Ease improvement |
| **Output Coherence** | ≥ 90% | Logical flow and structure |
| **Completeness** | ≥ 85% | All key points from input covered |
| **Harmful Output Rate** | ≤ 0.1% | Inappropriate or harmful responses |

### 3.2 Embedding Quality (Xenova/all-MiniLM-L6-v2)
| Metric | Target | Description |
|--------|--------|-------------|
| **Embedding Generation Success** | ≥ 99.5% | Chunks successfully embedded |
| **Embedding Consistency** | ≥ 99% | Same text → same embedding |
| **Semantic Similarity Accuracy** | ≥ 80% | Similar texts have high cosine similarity |
| **Embedding Dimension Correctness** | 100% | All embeddings are 384-dimensional |

### 3.3 RAG Retrieval Quality
| Metric | Target | Description |
|--------|--------|-------------|
| **Precision@k (k=5)** | ≥ 80% | Relevant chunks in top-5 results |
| **Recall@k (k=5)** | ≥ 70% | Relevant chunks retrieved |
| **Mean Reciprocal Rank (MRR)** | ≥ 0.85 | Rank of first relevant chunk |
| **Context Sufficiency** | ≥ 85% | Retrieved context sufficient to answer query |
| **False Positive Rate** | ≤ 15% | Irrelevant chunks retrieved |

### 3.4 Document Processing Quality
| Metric | Target | Description |
|--------|--------|-------------|
| **PDF Text Extraction Accuracy** | ≥ 95% | Text correctly extracted from PDFs |
| **Text Chunking Quality** | ≥ 90% | Chunks maintain semantic coherence |
| **Document Guard Precision** | ≥ 95% | Correct identification of doc type |
| **Document Guard Recall** | ≥ 90% | Valid documents not rejected |

---

## 4. User Experience Metrics

### 4.1 User Satisfaction
| Metric | Target | Description |
|--------|--------|-------------|
| **Simplification Like Rate** | ≥ 70% | % of simplifications liked by users |
| **Average Session Duration** | ≥ 10 minutes | Time spent per session |
| **Feature Usage Distribution** | Balanced | Users actively use multiple features |
| **Repeat User Rate** | ≥ 60% | Users returning within 7 days |
| **Task Completion Rate** | ≥ 85% | Users successfully complete their tasks |

### 4.2 Error Handling
| Metric | Target | Description |
|--------|--------|-------------|
| **User-Facing Error Rate** | ≤ 2% | API errors shown to users |
| **Error Message Clarity** | ≥ 90% | Errors understandable by users |
| **Graceful Degradation** | ≥ 95% | Partial failures don't crash system |
| **Recovery Success Rate** | ≥ 90% | Users can retry after errors |

### 4.3 Content Quality
| Metric | Target | Description |
|--------|--------|-------------|
| **Simplified Text Readability** | Grade 8-10 | Reading grade level (Flesch-Kincaid) |
| **Language Clarity Score** | ≥ 80% | Clear, understandable language |
| **Legal Term Explanation Rate** | ≥ 80% | Complex terms are explained |
| **Structure Preservation** | ≥ 85% | Original document structure maintained |

---

## 5. Security & Reliability Metrics

### 5.1 Security
| Metric | Target | Description |
|--------|--------|-------------|
| **Password Hash Strength** | BCrypt 10+ rounds | Secure password hashing |
| **JWT Token Expiry Compliance** | 100% | Tokens expire in 30 days |
| **Unauthorized Access Attempts** | 0% success | Blocked unauthorized requests |
| **SQL/NoSQL Injection Attempts Blocked** | 100% | All injection attempts prevented |
| **CORS Configuration Correctness** | Properly configured | Secure cross-origin handling |
| **Sensitive Data Exposure** | 0 incidents | No API keys, passwords in responses |

### 5.2 Reliability & Availability
| Metric | Target | Description |
|--------|--------|-------------|
| **System Uptime** | ≥ 99.5% | Overall availability |
| **API Success Rate** | ≥ 98% | Successful API calls |
| **Database Availability** | ≥ 99.9% | MongoDB connection uptime |
| **Groq API Success Rate** | ≥ 99% | Successful LLM API calls |
| **Mean Time Between Failures (MTBF)** | ≥ 168 hours | Average time between failures |
| **Mean Time To Recovery (MTTR)** | ≤ 30 minutes | Time to recover from failures |

### 5.3 Data Integrity
| Metric | Target | Description |
|--------|--------|-------------|
| **Data Write Success** | ≥ 99.9% | Successful DB writes |
| **Data Consistency** | 100% | No data corruption |
| **Backup Success Rate** | ≥ 99.5% | Successful DB backups |
| **Data Loss Rate** | 0% | Zero data loss incidents |

---

## 6. Data & Storage Metrics

### 6.1 Database Performance
| Metric | Target | Description |
|--------|--------|-------------|
| **Query Response Time** | ≤ 100ms | P95 for simple queries |
| **Aggregation Query Time** | ≤ 500ms | P95 for dashboard stats |
| **Write Latency** | ≤ 50ms | P95 for inserts/updates |
| **Index Hit Rate** | ≥ 95% | Queries using indexes |
| **Database Connection Time** | ≤ 100ms | Time to establish connection |

### 6.2 Storage Efficiency
| Metric | Target | Description |
|--------|--------|-------------|
| **Database Growth Rate** | ≤ 10GB/month | Storage growth under normal usage |
| **Embedding Storage Efficiency** | ~1.5KB/chunk | 384-dim float embeddings |
| **HNSW Index Size** | ≤ 2x embeddings | Index overhead |
| **Duplicate Data Rate** | ≤ 1% | Redundant data in DB |

### 6.3 File Processing
| Metric | Target | Description |
|--------|--------|-------------|
| **Max PDF Size Supported** | ≥ 10MB | Maximum file upload size |
| **PDF Processing Success Rate** | ≥ 90% | Valid PDFs processed successfully |
| **Average Chunks Per PDF** | 20-100 | Typical document chunking |
| **Text Extraction Accuracy** | ≥ 95% | Text correctly extracted |

---

## 7. API Health Metrics

### 7.1 Endpoint Availability
| Endpoint Category | Target Uptime | P95 Latency Target |
|-------------------|---------------|-------------------|
| **Auth Endpoints** | ≥ 99.9% | ≤ 300ms |
| **Simplification Endpoints** | ≥ 99% | ≤ 10s |
| **Chat Endpoints** | ≥ 99% | ≤ 8s |
| **Dashboard Endpoints** | ≥ 99.5% | ≤ 1s |

### 7.2 Error Rates by Endpoint
| Metric | Target | Description |
|--------|--------|-------------|
| **4xx Error Rate** | ≤ 5% | Client errors (validation, auth) |
| **5xx Error Rate** | ≤ 1% | Server errors |
| **Timeout Rate** | ≤ 2% | Request timeouts |
| **Rate Limit Hits** | Track only | Monitor for abuse |

### 7.3 External Dependencies
| Metric | Target | Description |
|--------|--------|-------------|
| **Groq API Success Rate** | ≥ 99% | Successful LLM API calls |
| **Groq API Latency** | ≤ 3s | P95 response time |
| **MongoDB Availability** | ≥ 99.9% | Database connection uptime |
| **MongoDB Response Time** | ≤ 100ms | P95 query latency |

---

## 8. Business Metrics

### 8.1 User Engagement
| Metric | Target | Description |
|--------|--------|-------------|
| **Daily Active Users (DAU)** | Track & grow | Unique users per day |
| **Weekly Active Users (WAU)** | Track & grow | Unique users per week |
| **Monthly Active Users (MAU)** | Track & grow | Unique users per month |
| **DAU/MAU Ratio** | ≥ 0.3 | User stickiness |
| **New User Registration Rate** | Track & grow | New signups per day |

### 8.2 Feature Adoption
| Metric | Target | Description |
|--------|--------|-------------|
| **Law Simplification Usage** | ≥ 40% of users | Users using law simplifier |
| **Judgement Simplification Usage** | ≥ 40% of users | Users using judgement simplifier |
| **RAG Chat Usage** | ≥ 50% of users | Users using chat feature |
| **PDF Upload Rate** | ≥ 30% | Users uploading PDFs vs text |
| **Multi-feature Users** | ≥ 60% | Users using 2+ features |

### 8.3 Content Generation
| Metric | Target | Description |
|--------|--------|-------------|
| **Simplifications Per User** | ≥ 5 | Average simplifications generated |
| **Chat Messages Per User** | ≥ 10 | Average chat interactions |
| **Documents Processed Per Day** | Track & grow | Total documents processed |
| **Embeddings Generated Per Day** | Track & grow | Total chunks embedded |

### 8.4 Cost Efficiency
| Metric | Target | Description |
|--------|--------|-------------|
| **Cost Per LLM Call** | Track & optimize | Groq API cost per request |
| **Cost Per User** | Track & optimize | Infrastructure cost per MAU |
| **Token Usage Efficiency** | Track & optimize | Tokens used per response |
| **Infrastructure Cost/Revenue** | Track ratio | Operational efficiency |

---

## 9. Testing & Quality Assurance Metrics

### 9.1 Test Coverage
| Metric | Target | Description |
|--------|--------|-------------|
| **Unit Test Coverage** | ≥ 80% | Code coverage by unit tests |
| **Integration Test Coverage** | ≥ 70% | API endpoint coverage |
| **E2E Test Coverage** | ≥ 50% | Critical user journeys |
| **Test Execution Time** | ≤ 5 minutes | Full test suite run time |
| **Test Pass Rate** | ≥ 98% | Successful test runs |

### 9.2 Code Quality
| Metric | Target | Description |
|--------|--------|-------------|
| **Code Review Coverage** | 100% | All changes reviewed |
| **Static Analysis Score** | ≥ A | ESLint/code quality score |
| **Technical Debt Ratio** | ≤ 5% | Debt vs total code |
| **Cyclomatic Complexity** | ≤ 10 | Per function average |
| **Dependency Vulnerabilities** | 0 high/critical | Security audit results |

---

## 10. Monitoring & Observability

### 10.1 Key Metrics to Monitor in Production
- **Real-time API latency** (P50, P95, P99)
- **Error rates by endpoint**
- **LLM call success/failure rates**
- **Database query performance**
- **Memory and CPU usage**
- **Active connection counts**
- **Request queue depth**
- **Cache hit/miss rates** (if caching implemented)

### 10.2 Alerting Thresholds
| Alert | Threshold | Severity |
|-------|-----------|----------|
| **5xx Error Rate** | > 2% | Critical |
| **API Latency P95** | > 15s | Warning |
| **Database Connection Failures** | > 5 in 5 min | Critical |
| **Groq API Failures** | > 5% | Warning |
| **Memory Usage** | > 90% | Critical |
| **CPU Usage** | > 90% for 5 min | Warning |
| **Disk Space** | > 85% | Warning |

---

## Measurement & Reporting

### Recommended Tools
- **APM**: New Relic, Datadog, or Application Insights
- **Logging**: Winston + ELK Stack or CloudWatch
- **Metrics**: Prometheus + Grafana
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom or UptimeRobot

### Reporting Frequency
- **Real-time dashboards**: Continuous
- **Daily reports**: Key metrics + anomalies
- **Weekly reports**: Trends + user engagement
- **Monthly reports**: Business metrics + cost analysis
- **Quarterly reviews**: Strategic metrics + improvements

### Continuous Improvement
1. **Establish baselines** for all metrics
2. **Set up automated monitoring** and alerting
3. **Review metrics weekly** with the team
4. **Identify bottlenecks** and optimization opportunities
5. **Track improvements** after changes
6. **Iterate on metrics** as system evolves

---

## Conclusion

These evaluation metrics provide a comprehensive framework for assessing the Justice Bridge backend across functional, performance, quality, and business dimensions. Regular monitoring and optimization based on these metrics will ensure a high-quality, reliable, and user-friendly legal assistance platform.

**Next Steps:**
1. Implement monitoring infrastructure
2. Establish baseline measurements
3. Set up dashboards for key metrics
4. Configure alerting for critical thresholds
5. Schedule regular metric reviews
6. Create feedback loops for continuous improvement
