export const COLORS = {
    gray0: "#f8f9fa",
    gray1: "#f1f3f5",
    gray2: "#e9ecef",
    gray3: "#dee2e6",
    gray4: "#ced4da",
    gray5: "#adb5bd",
    gray6: "#868e96",
    gray7: "#495057",
    gray8: "#343a40",
    gray9: "#212529",
    orange3: "#ffc078",
    indigo7: "#4c6ef5", // indigo-7 from open-props is typically around this, let's use the one from the file if needed, but the user's theme uses orange-3 for dark mode brand.
    white: "#ffffff",
} as const;

export const THEME = {
    bg: COLORS.gray9,
    text: COLORS.gray1,
    accent: COLORS.orange3,
    surface: COLORS.gray8,
};
