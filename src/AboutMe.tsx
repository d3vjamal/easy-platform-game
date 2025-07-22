import React from 'react';
import './About.css';
import profilePhoto from './assets/d3vjamal.jpg';
import { Typography } from '@mui/material';
import { FacebookIcon, LinkedinIcon, MailIcon } from 'lucide-react';


const AboutMe: React.FC = () => {
    // Set locale, fallback to 'en-US'


    return (
        <section className="about-me">
            <img src={profilePhoto} alt="Profile of Jamaluddin Mondal" className="profile-photo small" />
            <div className="about-text">
                <h2>About Me</h2>
                <p>
                    I’m passionate about web development, programming, and all things tech. With a strong background in backend engineering, I enjoy building scalable and efficient applications. Outside of work, I’m a movie enthusiast and a food lover.<br /><br />
                    Feel free to get in touch — I’m open to exciting opportunities and collaborations!
                </p>
                <p className="contact-info">

                    <Typography variant="body2">

                        <a href="https://www.facebook.com/d3vjamal" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <FacebookIcon style={{ fontSize: 16 }} />
                        </a>
                        &nbsp;&nbsp;

                        <a href="https://www.linkedin.com/in/d3vjamal" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <LinkedinIcon style={{ fontSize: 16 }} />
                        </a>
                        &nbsp;&nbsp;

                        <a href="mailto:d3v.jamal@gmail.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MailIcon style={{ fontSize: 16 }} />
                        </a>

                    </Typography>

                </p>

            </div>

        </section >
    );
};

export default AboutMe;
