

function getInitials(fullName) {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    const first = names[0]?.[0] || "";
    const last = names.length > 1 ? names[names.length - 1][0] : "";
    return (first + last).toUpperCase();
}


function stringToColor(str) {
    if (!str) return "#ccc"; // fallback color
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
        ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
        ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
    return color.slice(0, 7);
}


function Avatar({ fullName }) {


    const Name = "Trial Name";
    const initials = getInitials(fullName);
    const bgColor = stringToColor(fullName);


    return (
        <div
            style={{
                backgroundColor: bgColor,
                color: "white",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
                marginRight: "5px",
                textTransform: "uppercase",
            }}
            title={fullName}
        >
            {initials}
        </div>
    );





}
export default Avatar;