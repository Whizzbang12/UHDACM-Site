import styles from './statscard.module.css'

export type ClubStatProps = {
    header: string;
    subheader: string;
    color: "orange" | "blue";
}

function StatItem({header, subheader, color}: ClubStatProps){

    const accent = {
        orange: styles.orangeHeader,
        blue: styles.blueHeader
    }


    return(
        <div className={styles.statItem}>
            <div className={`${accent[color]} ${styles.header}`}>
                {header}
            </div>

            <div className={styles.subHeader}>
                {subheader}
            </div>
        </div>
    )
}



export const stats: ClubStatProps[] = [
{
    header:"100+",
    subheader:"Club members",
    color: "orange",
},
{
    header: "25+",
    subheader: "Events Per Year",
    color: "blue",
},
{
    header: "10+",
    subheader:"Years of impact",
    color:"orange",

}
]

export function ClubStatsRow(){
    return(
        <div className={styles.statsContainer}>
            {stats.map((stat, index) =>(
                <StatItem
                    key={index}
                    header={stat.header}
                    subheader={stat.subheader}
                    color={stat.color}
                />
            ))}

        </div>
    )

}