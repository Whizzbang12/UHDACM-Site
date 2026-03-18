import { LuHeart,LuTarget, LuCode, LuUsersRound } from "react-icons/lu";
import styles from './featurecard.module.css'

const icons = {
    heart: LuHeart,
    target: LuTarget,
    code: LuCode,
    users: LuUsersRound,
}

export type FeatureCardProps = {
    icon: "heart" | "target" | "code"| "users";
    color: "orange" | "blue" ; // for svg and hover
    title: string;
    description: string;
}

function FeatureCard({icon, color, title, description}: FeatureCardProps){

    const accent = {
        orange: {
            hover: styles.orangeHover,
            iconBg: styles.orangeIconBg,
            iconClr: styles.orangeIconClr,
            circleClr: styles.orangeCircle
        },
        blue: {
            hover: styles.blueHover,
            iconBg: styles.blueIconBg,
            iconClr: styles.blueIconClr,
            circleClr: styles.blueCircle
        },
    }
    const c = accent[color]
    const Icon = icons[icon]

    return(
        <div 
            className={`${c.hover} ${styles.card}`}
        >
            {/* top right circle*/}
            <div className={` ${styles.circle} ${c.circleClr}`}>

            </div>

            <div 
                className={` ${styles.iconBox} ${c.iconBg} ${c.iconClr}`}
            >
                <Icon size={20}/>
            </div>

            <h1 className={styles.title} >
                {title}
            </h1>
                
            <p className={styles.description} >
                {description}
            </p>

        </div>

    )    
}

export const cards: FeatureCardProps[] = [
    {
        icon: "target",
        color: "orange",
        title: "Skill Development",
        description: "Build technical skills through workshops, hackathons, and hands-on projects",
    },
    {
        icon: "code",
        color: "blue",
        title: "Real Projects",
        description: "Work on meaningful projects that make a difference and build your portfolio.",
    },
    {
        icon: "users",
        color: "orange",
        title: "Community",
        description: "Connect with like-minded students and build lasting professional relationships.", 
    },
    {
        icon: "heart",
        color: "blue",
        title: "Support",
        description: "Get mentorship and guidance from experienced members and industry professionals.",
    }

]

export function FeatureCardRow(){
    return(
    <div className={styles.CardRow}>
        {cards.map((card,index) => (
            <FeatureCard
                key={index}
                icon={card.icon}
                color={card.color}
                title={card.title}
                description={card.description}
            />
        ))}
    </div>
    )
}