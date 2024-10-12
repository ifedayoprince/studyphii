export interface LemonsqueezyOrderAttributes {
    status: "paid";
    user_email: string;
    user_name: string;
    customer_id: number;
    id: string;
    first_order_item: {
        id: number;
        price_id: number;
        variant_id: number;
        variant_name: string;
        subscription_id: number;
    };
}
export interface LemonsqueezyWebhookPayload {
    data: {
        attributes: LemonsqueezyOrderAttributes;
        id: string;
        relationships: unknown;
        type: string;
    };
    meta: {
        custom_data: {
            study_guide_id: string;
        };
        event_name: "order_created"
        test_mode: boolean;
    };
}