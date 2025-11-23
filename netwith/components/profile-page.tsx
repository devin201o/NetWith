import React from "react";

type Profile = {
    id: string;
    name: string;
    email: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
    experience?: string[];
    education?: string;
    profileImageUrl?: string;
    lookingFor?: "mentor" | "partner" | "network";
};

type ProfilePageProps = {
    profile: Profile;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <img
                    src={profile.profileImageUrl || "/default-avatar.png"}
                    alt={`${profile.name} profile`}
                    style={styles.image}
                />

                <h1 style={styles.name}>{profile.name}</h1>
                <p style={styles.email}>{profile.email}</p>

                {profile.bio && <p style={styles.bio}>{profile.bio}</p>}

                <Section title="Skills" items={profile.skills} />
                <Section title="Interests" items={profile.interests} />
                <Section title="Experience" items={profile.experience} />

                {profile.education && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Education</h3>
                        <p>{profile.education}</p>
                    </div>
                )}

                {profile.lookingFor && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Looking For</h3>
                        <p>{profile.lookingFor}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; items?: string[] }> = ({
    title,
    items,
}) => {
    if (!items || items.length === 0) return null;

    return (
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{title}</h3>
            <ul style={styles.list}>
                {items.map((item, i) => (
                    <li key={i} style={styles.listItem}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

//
// Basic inline styles (you can replace these with Tailwind or CSS modules)
//
const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
    },
    card: {
        maxWidth: "600px",
        width: "100%",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
    },
    image: {
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "1rem",
    },
    name: {
        margin: 0,
        fontSize: "1.8rem",
        fontWeight: 600,
    },
    email: {
        margin: "0.25rem 0 1rem",
        color: "#666",
    },
    bio: {
        fontStyle: "italic",
        marginBottom: "1rem",
    },
    section: {
        marginTop: "1.5rem",
    },
    sectionTitle: {
        fontSize: "1.2rem",
        fontWeight: 600,
        marginBottom: "0.5rem",
    },
    list: {
        paddingLeft: "1.2rem",
    },
    listItem: {
        marginBottom: "0.25rem",
    },
};

export default ProfilePage;
