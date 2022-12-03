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
                <p>Meet our Team</p>
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

    return (
        <div style={{ width: "100%", height: "450px" }}>
            <Collapse in={!isOpen}>
                <div style={{ height: "275px" }}>
                    <Image
                        src={entry.student.headshot.src}
                        alt={entry.student.headshot.alt}
                        fluid
                        rounded
                    />
                </div>
            </Collapse>
            <div className="text-section">
                <p>{entry.student.name}</p>
                <p>{entry.student.major}</p>
            </div>
            <Collapse in={isOpen}>
                <div className="collapse-text">
                    <p>About: Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, ut. Nulla dolorum ipsam, unde mollitia eum cumque consequatur! Ratione, doloribus.</p>
                    <p>Email: {entry.student.email}</p>
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
        </div>
    )
}


function TemporaryIcon() {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" id="body_1" viewBox="-48 0.02 234.63 139.89">
                <g transform="matrix(0.35064936 0 0 0.35087723 0 0)">
                    <g transform="matrix(0.3997996 0 0 0.3997996 0.39279625 -0)">
                        <g transform="matrix(0.1 0 -0 -0.1 0 998)">
                            <path d="M4620 9970C 4023 9932 3463 9719 2965 9341C 2839 9246 2536 8945 2440 8820C 2011 8260 1800 7648 1800 6959C 1800 6466 1895 6052 2105 5625C 2239 5352 2381 5144 2588 4914C 2765 4718 3022 4505 3245 4372C 3303 4337 3350 4307 3350 4305C 3350 4303 3320 4292 3283 4280C 3150 4236 2882 4126 2725 4051C 1949 3676 1273 3093 778 2370C 436 1872 181 1258 61 645C 22 447 6 321 12 266C 28 125 161 7 304 7C 376 8 425 27 481 77C 549 139 566 179 599 365C 682 818 803 1184 1006 1590C 1450 2478 2166 3187 3051 3614C 4544 4336 6254 4092 7545 2975C 8310 2312 8844 1380 9016 405C 9051 206 9055 192 9089 138C 9126 80 9187 34 9255 15C 9377 -21 9527 52 9583 173C 9619 250 9622 292 9600 436C 9501 1105 9240 1782 8870 2335C 8269 3232 7404 3905 6388 4264L6388 4264L6271 4306L6378 4370C 6772 4609 7150 4988 7391 5385C 7997 6384 7971 7655 7325 8625C 7105 8955 6804 9255 6470 9477C 6030 9771 5535 9935 4985 9970C 4812 9981 4793 9981 4620 9970zM5140 9445C 5576 9380 5996 9193 6356 8904C 6885 8479 7243 7833 7311 7181C 7326 7038 7317 6730 7295 6600C 7212 6111 6991 5678 6640 5316C 6231 4895 5714 4633 5135 4555C 4954 4530 4644 4532 4462 4559C 3625 4684 2905 5204 2545 5945C 2431 6178 2366 6386 2330 6632C 2303 6815 2303 7095 2330 7278C 2441 8036 2905 8716 3589 9124C 3900 9309 4244 9423 4600 9459C 4725 9472 5008 9464 5140 9445z" stroke="none" fill="#000000" fillRule="nonzero" />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
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