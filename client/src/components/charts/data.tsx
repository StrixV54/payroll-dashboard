export const barData = [
  {
    year: "2017",
    Investment: 87,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 134,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 51,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 86,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
  {
    year: "2018",
    Investment: 180,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 130,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 79,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 60,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
  {
    year: "2019",
    Investment: 80,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 30,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 79,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 20,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
  {
    year: "2020",
    Investment: 109,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 120,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 76,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 11,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
  {
    year: "2021",
    Investment: 179,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 136,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 173,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 51,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
  {
    year: "2022",
    Investment: 109,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 120,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 76,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 11,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
  {
    year: "2023",
    Investment: 141,
    InvestmentColor: "hsl(204, 70%, 50%)",
    Profit: 180,
    ProfitColor: "hsl(26, 70%, 50%)",
    Loss: 30,
    LossColor: "hsl(336, 70%, 50%)",
    Maintenance: 71,
    MaintenanceColor: "hsl(93, 70%, 50%)",
  },
];

export const pieData = [
  {
    id: "Support",
    label: "Support",
    value: 73,
    color: "hsl(22, 70%, 50%)",
  },
  {
    id: "Development",
    label: "Development",
    value: 176,
    color: "hsl(113, 70%, 50%)",
  },
  {
    id: "Sales",
    label: "Sales",
    value: 104,
    color: "hsl(74, 70%, 50%)",
  },
  {
    id: "Executive",
    label: "Executive",
    value: 36,
    color: "hsl(193, 74%, 47%)",
  },
];

export const lineDataYear = [
  {
    id: "norway",
    color: "hsl(332, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 278,
      },
      {
        x: "helicopter",
        y: 139,
      },
      {
        x: "boat",
        y: 229,
      },
      {
        x: "train",
        y: 149,
      },
      {
        x: "subway",
        y: 210,
      },
      {
        x: "bicycle",
        y: 286,
      },
      {
        x: "horse",
        y: 253,
      },
      {
        x: "skateboard",
        y: 65,
      },
      {
        x: "others",
        y: 260,
      },
    ],
  },
];

export const lineDataMonth = [
  {
    id: "germany",
    color: "hsl(145, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 247,
      },
      {
        x: "moto",
        y: 82,
      },
      {
        x: "bicycle",
        y: 181,
      },
      {
        x: "horse",
        y: 16,
      },
      {
        x: "skateboard",
        y: 293,
      },
      {
        x: "others",
        y: 279,
      },
    ],
  },
];

export const radialData = [
  {
    id: "Supermarket",
    data: [
      {
        x: "Vegetables",
        y: 205,
      },
      {
        x: "Fruits",
        y: 76,
      },
      {
        x: "Meat",
        y: 299,
      },
      {
        x: "Fish",
        y: 69,
      },
    ],
  },
  {
    id: "Combini",
    data: [
      {
        x: "Vegetables",
        y: 68,
      },
      {
        x: "Fruits",
        y: 75,
      },
      {
        x: "Meat",
        y: 288,
      },
      {
        x: "Fish",
        y: 149,
      },
    ],
  },
  {
    id: "Online",
    data: [
      {
        x: "Vegetables",
        y: 128,
      },
      {
        x: "Fruits",
        y: 132,
      },
      {
        x: "Meat",
        y: 185,
      },
      {
        x: "Fish",
        y: 231,
      },
    ],
  },
  {
    id: "Marché",
    data: [
      {
        x: "Vegetables",
        y: 209,
      },
      {
        x: "Fruits",
        y: 256,
      },
      {
        x: "Meat",
        y: 174,
      },
      {
        x: "Fish",
        y: 239,
      },
    ],
  },
];

export const apexChart = {
  options: {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};
