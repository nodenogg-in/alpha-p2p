export declare const cardColors: readonly ["neutral", "red", "orange", "yellow", "green", "blue", "purple", "pink", "turquoise", "putty"];
export type ColorName = (typeof cardColors)[number];
export declare const getColorName: (name: ColorName | string, type?: number) => string;
export declare const getCardColor: (type?: number, name?: string | ColorName) => string;
//# sourceMappingURL=colors.d.ts.map