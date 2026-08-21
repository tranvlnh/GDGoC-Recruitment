export interface PlanetPillar {
    id: string;
    name: string;
    title: string;
    tagline: string;
    description: string;
    color: string;
    colorKey: "blue" | "red" | "yellow" | "green";
    planetSvg: string;
    planetSize: string;
    positionClass: string;
    images: string[];
}

export const BASE_PLANET_PILLARS: Omit<PlanetPillar, "images">[] = [
    {
        id: "learn",
        name: "Learn",
        title: "Learn",
        tagline: "Học hỏi & Thực chiến",
        description:
            "Ở GDG on Campus: PTIT, học tập là hành động. Thay vì chỉ lắng nghe, bạn sẽ được bắt tay vào làm, được thử nghiệm và sai sót trong một môi trường an toàn. Nắm vững công nghệ mới qua các dự án chuyên sâu, biến ý tưởng thành sản phẩm và học hỏi từ chính những thử thách thực tế là cách bạn sẽ tiến bộ tại đây.",
        color: "#4285F4",
        colorKey: "blue",
        planetSvg: "/planet4.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "top-1 left-4 sm:top-2 sm:left-6 md:top-3 md:left-8",
    },
    {
        id: "share",
        name: "Share",
        title: "Share",
        tagline: "Chia sẻ & Lan tỏa",
        description:
            "GDG on Campus: PTIT tin rằng giá trị của kiến thức nằm ở sự lan tỏa. Một văn hóa cởi mở được xây dựng, nơi mọi góc nhìn đều được tôn trọng và bất kỳ ai cũng có thể là người chia sẻ. Qua việc chia sẻ, bạn không chỉ giúp cộng đồng cùng phát triển mà còn củng cố kiến thức và xây dựng sự tự tin.",
        color: "#EA4335",
        colorKey: "red",
        planetSvg: "/planet6.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "top-1 right-4 sm:top-2 sm:right-6 md:top-3 md:right-8",
    },
    {
        id: "connect",
        name: "Connect",
        title: "Connect",
        tagline: "Kết nối & Mở rộng",
        description:
            "GDG on Campus: PTIT mở ra cánh cửa đến với một mạng lưới kết nối rộng lớn và giá trị. Đây không chỉ là nơi bạn tìm thấy những người bạn cùng chung đam mê, mà còn là cơ hội gặp gỡ các chuyên gia, diễn giả và tiếp cận cộng đồng Google Developer toàn cầu.",
        color: "#FBBC05",
        colorKey: "yellow",
        planetSvg: "/planet1.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "bottom-1 right-4 sm:bottom-2 sm:right-6 md:bottom-3 md:right-8",
    },
    {
        id: "grow",
        name: "Grow",
        title: "Grow",
        tagline: "Phát triển & Bứt phá",
        description:
            "Learn, Share, và Connect chính là ba mảnh ghép tạo nên sự trưởng thành toàn diện tại GDG on Campus: PTIT. GDG on Campus: PTIT sẽ là bệ phóng để biến tiềm năng của bạn thành những thành tựu thực sự, ghi dấu ấn trong hành trình sinh viên của mình.",
        color: "#34A853",
        colorKey: "green",
        planetSvg: "/planet5.svg",
        planetSize: "w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32",
        positionClass: "bottom-1 left-4 sm:bottom-2 sm:left-6 md:bottom-3 md:left-8",
    },
];

export const DEFAULT_PLANET_PILLARS: PlanetPillar[] = BASE_PLANET_PILLARS.map((pillar) => ({
    ...pillar,
    images: [],
}));
