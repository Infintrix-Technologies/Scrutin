
export interface FrappeWindow extends Window {
    frappe?: {
        boot?: {
            versions?: {
                frappe?: string;
            };
            sitename?: string;
        };
    };
}