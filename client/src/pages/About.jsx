import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';

export default function About() {

        return (

            <>
            <HeaderPage page={"about"}/>
            
            <div className="center">

                <div className="description about">
                    Night City is an intelligent urban platform designed to centralize building management, connected devices, and local information.

                    Monitor your infrastructure in real time, control your devices remotely, and stay informed about your building's news — all from a single interface, available 24/7.

                    The city never sleeps. Neither do we.
                </div>

            </div>


            <FooterPage/>
            </>

        )
    }

