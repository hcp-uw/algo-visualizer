import { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.css";
import './index.css'
import { FaLinkedin, FaCaretDown, FaCaretUp } from "react-icons/fa"
import Collapse from 'react-bootstrap/Collapse';
import { Image } from 'react-bootstrap';
import { client } from "../../App"

interface DeveloperData {
    name: string
    email: string
    major: string
    socials: SocialLinks[]
    headshot: {
        src: string
        alt: string
    }
}

interface SocialLinks {
    fields: {
        githubUrl?: string
        linkedInUrl?: string
        portfolioUrl?: string
    }
}

export default function AboutUs() {
    const [studentData, setStudentData] = useState<{ [key: string]: DeveloperData }[] | null>(null)

    useEffect(() => {
        const getStudentDevelopers = async () => {
            try {
                const entries = await client.getEntries({
                    content_type: "studentDevelopers",
                    select: "fields",
                    include: 4,
                    "fields.slug": "Student Developers"
                }) as CMSData

                let data: { [key: string]: DeveloperData }[] = []

                entries.items.forEach((entry) => {
                    entry.fields.student.forEach((student) => {

                        const studentInfo = {
                            name: student.fields.preferredName,
                            email: student.fields.email,
                            major: student.fields.major,
                            socials: student.fields.socials.map(entry => entry) as SocialLinks[],
                            headshot: {
                                src: `https:${student.fields.headshot.fields.image.fields.file.url}`,
                                alt: student.fields.headshot.fields.alt,
                            }
                        } as DeveloperData

                        data.push({
                            student: studentInfo
                        })

                    })
                })
                setStudentData(data)
            } catch (error) {
                console.log(`error fetching student data: ${error}`)
            }
        }
        getStudentDevelopers()
    }, [])

    return (
        <div className="container">
            <div className="about-us">
                <p>Meet Our Team</p>
            </div>
            <div className="row">
                <div className="developer-container">
                    {studentData && (
                        studentData.map((entry, index) => {
                            return (
                                <div key={index} className='developer-container-item'>
                                    <DeveloperCard entry={entry} />
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

function DeveloperCard({ entry }: { entry: { [key: string]: DeveloperData } }) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    let linkedin = entry.student.socials.find(element => element.fields.linkedInUrl?.includes("linkedin")) ?? null
    let github = entry.student.socials.find(element => element.fields.githubUrl?.includes("github")) ?? null
    let portfolio = entry.student.socials.find(element => element.fields.portfolioUrl !== undefined) ?? null


    return (
        <div className="card">
            <Collapse in={!isOpen}>
                <div>
                    <Image
                        src={entry.student.headshot.src}
                        alt={entry.student.headshot.alt}
                        style={{
                            objectFit: "contain",
                            width: "250px",
                            height: "200px",
                        }}
                    />
                </div>
            </Collapse>
            <div className="text-section">
                <p>{entry.student.name}</p>
                <p>{entry.student.major}</p>
            </div>
            <Collapse in={isOpen}>
                <div className="collapse-text">
                    <ul>
                        {entry.student.email && (
                            <li>Email: {entry.student.email}</li>
                        )}
                        {github && (
                            <li
                                onClick={() => {
                                    window.open(github?.fields.githubUrl, "_blank")
                                }}
                                onMouseEnter={(event) => { event.currentTarget.style.cursor = "pointer" }}
                            >
                                Github
                            </li>
                        )}
                        {portfolio && (
                            <li
                                onClick={() => {
                                    window.open(portfolio?.fields.portfolioUrl, "_blank")
                                }}
                                onMouseEnter={(event) => { event.currentTarget.style.cursor = "pointer" }}
                            >
                                Portfolio
                            </li>
                        )}
                    </ul>
                </div>
            </Collapse>
            <div className="more-information">
                <div className="button-div">
                    {linkedin && (
                        <button
                            className="card-button"
                        >
                            <FaLinkedin
                                size="25px"
                                color="#4b2e83"
                                onMouseEnter={(event) => {
                                    event.currentTarget.style.transition = '0.2s'
                                    event.currentTarget.style.color = "#85754d"
                                }}
                                onMouseLeave={(event) => {
                                    event.currentTarget.style.color = "#4b2e83"
                                }}
                                onClick={() => {
                                    window.open(linkedin?.fields.linkedInUrl, "_blank")
                                }}
                            />
                        </button>
                    )}
                </div>
                <div>
                    <button
                        className="card-button more-button"
                        onClick={() => {
                            setIsOpen(!isOpen)
                        }}
                    >
                        <p style={{ paddingRight: "5px", paddingTop: "1px", color: "#000" }}>More</p>
                        <div>
                            {isOpen && (
                                <FaCaretUp color="#000" />
                            )}
                            {!isOpen && (
                                <FaCaretDown color="#000" />
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div >
    )
}

interface CMSData {
    items: {
        fields: {
            student: {
                fields: {
                    preferredName: string
                    email: string
                    major: string
                    headshot: {
                        fields: {
                            alt: string
                            image: {
                                fields: {
                                    file: {
                                        url: string
                                    }
                                }
                            }
                        }
                    }
                    socials: {
                        fields: {
                            linkedInUrl?: string
                            portfolioUrl?: string
                            githubUrl?: string
                        }
                    }[]
                }
            }[]
        }
    }[]
}