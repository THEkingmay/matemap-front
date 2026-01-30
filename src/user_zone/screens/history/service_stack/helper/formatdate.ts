// บันทึกการจองของผู้ใช้
export const formattimeToTH = (dateString: string | Date): string => {
    // 1. Safety check for null/undefined
    if (!dateString) return '-'

    // 2. Convert to Date object
    const date = new Date(dateString)

    // 3. Use Intl.DateTimeFormat for Thai Locale
    // This automatically converts to 'Asia/Bangkok' and uses the Buddhist calendar (2568)
    const formatter = new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'short',   // 'short' = ม.ค., 'long' = มกราคม
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,    // Use 24-hour format
        timeZone: 'Asia/Bangkok' // CRITICAL: Ensures correct time regardless of server location
    })

    // 4. Format the date and append "น."
    // Result example: "15 พ.ย. 2568 10:30 น."
    return `${formatter.format(date)} น.`
}