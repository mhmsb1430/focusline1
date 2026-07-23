import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Check,
  X,
  Flame,
  TrendingUp,
  Trash2,
  StickyNote,
  ChevronDown,
  Loader2,
  Calendar,
  ArrowRight,
  RotateCcw,
  Layers,
  FileDown,
  Home,
  Eye,
  Share2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ---------------------------------------------------------------
   Design tokens
----------------------------------------------------------------*/
// Bump this on every meaningful fix so we can tell, just by looking at the header,
// whether a stale cached build is being shown instead of the current one.
const BUILD_TAG = "build-46";

const C = {
  ink: "#0B3559",
  ink2: "#FFFFFF",
  panel: "#123F66",
  panelLight: "#1B4E7E",
  panelLighter: "#2A5580",
  gold: "#2C6CA3",
  goldSoft: "#E4EEF8",
  goldDim: "#5A8DBD",
  parchment: "#FFFFFF",
  parchmentDim: "#CFE3F5",
  sage: "#4CAF82",
  brick: "#E08668",
  muted: "#8FA9C4",
};
const SHADOW = "rgba(4,18,32,0.45)";

const WEEKDAYS = [
  { i: 6, label: "السبت" },
  { i: 0, label: "الأحد" },
  { i: 1, label: "الاثنين" },
  { i: 2, label: "الثلاثاء" },
  { i: 3, label: "الأربعاء" },
  { i: 4, label: "الخميس" },
  { i: 5, label: "الجمعة" },
];

// مصفوفة بيانات صفحات مصحف المدينة (604 صفحة)
// المصدر: api.quran.com/api/v4 (Quran Foundation) — تم التحقق آليًا من الدقة
// PA[n] تمثل الصفحة رقم n (index 0 غير مستخدم)
// كل عنصر: { page, surahStart, ayahStart, surahEnd, ayahEnd, ayahCount, juzStart, juzEnd, hizbStart, hizbEnd, rubStart, rubEnd }
const PA = [null,{"page":1,"surahStart":1,"ayahStart":1,"surahEnd":1,"ayahEnd":7,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":1,"rubEnd":1},{"page":2,"surahStart":2,"ayahStart":1,"surahEnd":2,"ayahEnd":5,"ayahCount":5,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":1,"rubEnd":1},{"page":3,"surahStart":2,"ayahStart":6,"surahEnd":2,"ayahEnd":16,"ayahCount":11,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":1,"rubEnd":1},{"page":4,"surahStart":2,"ayahStart":17,"surahEnd":2,"ayahEnd":24,"ayahCount":8,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":1,"rubEnd":1},{"page":5,"surahStart":2,"ayahStart":25,"surahEnd":2,"ayahEnd":29,"ayahCount":5,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":1,"rubEnd":2},{"page":6,"surahStart":2,"ayahStart":30,"surahEnd":2,"ayahEnd":37,"ayahCount":8,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":2,"rubEnd":2},{"page":7,"surahStart":2,"ayahStart":38,"surahEnd":2,"ayahEnd":48,"ayahCount":11,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":2,"rubEnd":3},{"page":8,"surahStart":2,"ayahStart":49,"surahEnd":2,"ayahEnd":57,"ayahCount":9,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":3,"rubEnd":3},{"page":9,"surahStart":2,"ayahStart":58,"surahEnd":2,"ayahEnd":61,"ayahCount":4,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":3,"rubEnd":4},{"page":10,"surahStart":2,"ayahStart":62,"surahEnd":2,"ayahEnd":69,"ayahCount":8,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":1,"rubStart":4,"rubEnd":4},{"page":11,"surahStart":2,"ayahStart":70,"surahEnd":2,"ayahEnd":76,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":1,"hizbEnd":2,"rubStart":4,"rubEnd":5},{"page":12,"surahStart":2,"ayahStart":77,"surahEnd":2,"ayahEnd":83,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":5,"rubEnd":5},{"page":13,"surahStart":2,"ayahStart":84,"surahEnd":2,"ayahEnd":88,"ayahCount":5,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":5,"rubEnd":5},{"page":14,"surahStart":2,"ayahStart":89,"surahEnd":2,"ayahEnd":93,"ayahCount":5,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":5,"rubEnd":6},{"page":15,"surahStart":2,"ayahStart":94,"surahEnd":2,"ayahEnd":101,"ayahCount":8,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":6,"rubEnd":6},{"page":16,"surahStart":2,"ayahStart":102,"surahEnd":2,"ayahEnd":105,"ayahCount":4,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":6,"rubEnd":6},{"page":17,"surahStart":2,"ayahStart":106,"surahEnd":2,"ayahEnd":112,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":7,"rubEnd":7},{"page":18,"surahStart":2,"ayahStart":113,"surahEnd":2,"ayahEnd":119,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":7,"rubEnd":7},{"page":19,"surahStart":2,"ayahStart":120,"surahEnd":2,"ayahEnd":126,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":7,"rubEnd":8},{"page":20,"surahStart":2,"ayahStart":127,"surahEnd":2,"ayahEnd":134,"ayahCount":8,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":8,"rubEnd":8},{"page":21,"surahStart":2,"ayahStart":135,"surahEnd":2,"ayahEnd":141,"ayahCount":7,"juzStart":1,"juzEnd":1,"hizbStart":2,"hizbEnd":2,"rubStart":8,"rubEnd":8},{"page":22,"surahStart":2,"ayahStart":142,"surahEnd":2,"ayahEnd":145,"ayahCount":4,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":9,"rubEnd":9},{"page":23,"surahStart":2,"ayahStart":146,"surahEnd":2,"ayahEnd":153,"ayahCount":8,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":9,"rubEnd":9},{"page":24,"surahStart":2,"ayahStart":154,"surahEnd":2,"ayahEnd":163,"ayahCount":10,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":9,"rubEnd":10},{"page":25,"surahStart":2,"ayahStart":164,"surahEnd":2,"ayahEnd":169,"ayahCount":6,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":10,"rubEnd":10},{"page":26,"surahStart":2,"ayahStart":170,"surahEnd":2,"ayahEnd":176,"ayahCount":7,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":10,"rubEnd":10},{"page":27,"surahStart":2,"ayahStart":177,"surahEnd":2,"ayahEnd":181,"ayahCount":5,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":11,"rubEnd":11},{"page":28,"surahStart":2,"ayahStart":182,"surahEnd":2,"ayahEnd":186,"ayahCount":5,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":11,"rubEnd":11},{"page":29,"surahStart":2,"ayahStart":187,"surahEnd":2,"ayahEnd":190,"ayahCount":4,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":11,"rubEnd":12},{"page":30,"surahStart":2,"ayahStart":191,"surahEnd":2,"ayahEnd":196,"ayahCount":6,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":12,"rubEnd":12},{"page":31,"surahStart":2,"ayahStart":197,"surahEnd":2,"ayahEnd":202,"ayahCount":6,"juzStart":2,"juzEnd":2,"hizbStart":3,"hizbEnd":3,"rubStart":12,"rubEnd":12},{"page":32,"surahStart":2,"ayahStart":203,"surahEnd":2,"ayahEnd":210,"ayahCount":8,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":13,"rubEnd":13},{"page":33,"surahStart":2,"ayahStart":211,"surahEnd":2,"ayahEnd":215,"ayahCount":5,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":13,"rubEnd":13},{"page":34,"surahStart":2,"ayahStart":216,"surahEnd":2,"ayahEnd":219,"ayahCount":4,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":13,"rubEnd":14},{"page":35,"surahStart":2,"ayahStart":220,"surahEnd":2,"ayahEnd":224,"ayahCount":5,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":14,"rubEnd":14},{"page":36,"surahStart":2,"ayahStart":225,"surahEnd":2,"ayahEnd":230,"ayahCount":6,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":14,"rubEnd":14},{"page":37,"surahStart":2,"ayahStart":231,"surahEnd":2,"ayahEnd":233,"ayahCount":3,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":14,"rubEnd":15},{"page":38,"surahStart":2,"ayahStart":234,"surahEnd":2,"ayahEnd":237,"ayahCount":4,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":15,"rubEnd":15},{"page":39,"surahStart":2,"ayahStart":238,"surahEnd":2,"ayahEnd":245,"ayahCount":8,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":15,"rubEnd":16},{"page":40,"surahStart":2,"ayahStart":246,"surahEnd":2,"ayahEnd":248,"ayahCount":3,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":16,"rubEnd":16},{"page":41,"surahStart":2,"ayahStart":249,"surahEnd":2,"ayahEnd":252,"ayahCount":4,"juzStart":2,"juzEnd":2,"hizbStart":4,"hizbEnd":4,"rubStart":16,"rubEnd":16},{"page":42,"surahStart":2,"ayahStart":253,"surahEnd":2,"ayahEnd":256,"ayahCount":4,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":17,"rubEnd":17},{"page":43,"surahStart":2,"ayahStart":257,"surahEnd":2,"ayahEnd":259,"ayahCount":3,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":17,"rubEnd":17},{"page":44,"surahStart":2,"ayahStart":260,"surahEnd":2,"ayahEnd":264,"ayahCount":5,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":17,"rubEnd":18},{"page":45,"surahStart":2,"ayahStart":265,"surahEnd":2,"ayahEnd":269,"ayahCount":5,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":18,"rubEnd":18},{"page":46,"surahStart":2,"ayahStart":270,"surahEnd":2,"ayahEnd":274,"ayahCount":5,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":18,"rubEnd":19},{"page":47,"surahStart":2,"ayahStart":275,"surahEnd":2,"ayahEnd":281,"ayahCount":7,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":19,"rubEnd":19},{"page":48,"surahStart":2,"ayahStart":282,"surahEnd":2,"ayahEnd":282,"ayahCount":1,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":19,"rubEnd":19},{"page":49,"surahStart":2,"ayahStart":283,"surahEnd":2,"ayahEnd":286,"ayahCount":4,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":20,"rubEnd":20},{"page":50,"surahStart":3,"ayahStart":1,"surahEnd":3,"ayahEnd":9,"ayahCount":9,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":5,"rubStart":20,"rubEnd":20},{"page":51,"surahStart":3,"ayahStart":10,"surahEnd":3,"ayahEnd":15,"ayahCount":6,"juzStart":3,"juzEnd":3,"hizbStart":5,"hizbEnd":6,"rubStart":20,"rubEnd":21},{"page":52,"surahStart":3,"ayahStart":16,"surahEnd":3,"ayahEnd":22,"ayahCount":7,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":21,"rubEnd":21},{"page":53,"surahStart":3,"ayahStart":23,"surahEnd":3,"ayahEnd":29,"ayahCount":7,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":21,"rubEnd":21},{"page":54,"surahStart":3,"ayahStart":30,"surahEnd":3,"ayahEnd":37,"ayahCount":8,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":21,"rubEnd":22},{"page":55,"surahStart":3,"ayahStart":38,"surahEnd":3,"ayahEnd":45,"ayahCount":8,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":22,"rubEnd":22},{"page":56,"surahStart":3,"ayahStart":46,"surahEnd":3,"ayahEnd":52,"ayahCount":7,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":22,"rubEnd":23},{"page":57,"surahStart":3,"ayahStart":53,"surahEnd":3,"ayahEnd":61,"ayahCount":9,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":23,"rubEnd":23},{"page":58,"surahStart":3,"ayahStart":62,"surahEnd":3,"ayahEnd":70,"ayahCount":9,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":23,"rubEnd":23},{"page":59,"surahStart":3,"ayahStart":71,"surahEnd":3,"ayahEnd":77,"ayahCount":7,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":23,"rubEnd":24},{"page":60,"surahStart":3,"ayahStart":78,"surahEnd":3,"ayahEnd":83,"ayahCount":6,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":24,"rubEnd":24},{"page":61,"surahStart":3,"ayahStart":84,"surahEnd":3,"ayahEnd":91,"ayahCount":8,"juzStart":3,"juzEnd":3,"hizbStart":6,"hizbEnd":6,"rubStart":24,"rubEnd":24},{"page":62,"surahStart":3,"ayahStart":92,"surahEnd":3,"ayahEnd":100,"ayahCount":9,"juzStart":3,"juzEnd":4,"hizbStart":6,"hizbEnd":7,"rubStart":24,"rubEnd":25},{"page":63,"surahStart":3,"ayahStart":101,"surahEnd":3,"ayahEnd":108,"ayahCount":8,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":25,"rubEnd":25},{"page":64,"surahStart":3,"ayahStart":109,"surahEnd":3,"ayahEnd":115,"ayahCount":7,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":25,"rubEnd":26},{"page":65,"surahStart":3,"ayahStart":116,"surahEnd":3,"ayahEnd":121,"ayahCount":6,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":26,"rubEnd":26},{"page":66,"surahStart":3,"ayahStart":122,"surahEnd":3,"ayahEnd":132,"ayahCount":11,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":26,"rubEnd":26},{"page":67,"surahStart":3,"ayahStart":133,"surahEnd":3,"ayahEnd":140,"ayahCount":8,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":27,"rubEnd":27},{"page":68,"surahStart":3,"ayahStart":141,"surahEnd":3,"ayahEnd":148,"ayahCount":8,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":27,"rubEnd":27},{"page":69,"surahStart":3,"ayahStart":149,"surahEnd":3,"ayahEnd":153,"ayahCount":5,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":27,"rubEnd":28},{"page":70,"surahStart":3,"ayahStart":154,"surahEnd":3,"ayahEnd":157,"ayahCount":4,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":28,"rubEnd":28},{"page":71,"surahStart":3,"ayahStart":158,"surahEnd":3,"ayahEnd":165,"ayahCount":8,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":7,"rubStart":28,"rubEnd":28},{"page":72,"surahStart":3,"ayahStart":166,"surahEnd":3,"ayahEnd":173,"ayahCount":8,"juzStart":4,"juzEnd":4,"hizbStart":7,"hizbEnd":8,"rubStart":28,"rubEnd":29},{"page":73,"surahStart":3,"ayahStart":174,"surahEnd":3,"ayahEnd":180,"ayahCount":7,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":29,"rubEnd":29},{"page":74,"surahStart":3,"ayahStart":181,"surahEnd":3,"ayahEnd":186,"ayahCount":6,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":29,"rubEnd":30},{"page":75,"surahStart":3,"ayahStart":187,"surahEnd":3,"ayahEnd":194,"ayahCount":8,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":30,"rubEnd":30},{"page":76,"surahStart":3,"ayahStart":195,"surahEnd":3,"ayahEnd":200,"ayahCount":6,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":30,"rubEnd":30},{"page":77,"surahStart":4,"ayahStart":1,"surahEnd":4,"ayahEnd":6,"ayahCount":6,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":31,"rubEnd":31},{"page":78,"surahStart":4,"ayahStart":7,"surahEnd":4,"ayahEnd":11,"ayahCount":5,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":31,"rubEnd":31},{"page":79,"surahStart":4,"ayahStart":12,"surahEnd":4,"ayahEnd":14,"ayahCount":3,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":32,"rubEnd":32},{"page":80,"surahStart":4,"ayahStart":15,"surahEnd":4,"ayahEnd":19,"ayahCount":5,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":32,"rubEnd":32},{"page":81,"surahStart":4,"ayahStart":20,"surahEnd":4,"ayahEnd":23,"ayahCount":4,"juzStart":4,"juzEnd":4,"hizbStart":8,"hizbEnd":8,"rubStart":32,"rubEnd":32},{"page":82,"surahStart":4,"ayahStart":24,"surahEnd":4,"ayahEnd":26,"ayahCount":3,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":33,"rubEnd":33},{"page":83,"surahStart":4,"ayahStart":27,"surahEnd":4,"ayahEnd":33,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":33,"rubEnd":33},{"page":84,"surahStart":4,"ayahStart":34,"surahEnd":4,"ayahEnd":37,"ayahCount":4,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":33,"rubEnd":34},{"page":85,"surahStart":4,"ayahStart":38,"surahEnd":4,"ayahEnd":44,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":34,"rubEnd":34},{"page":86,"surahStart":4,"ayahStart":45,"surahEnd":4,"ayahEnd":51,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":34,"rubEnd":34},{"page":87,"surahStart":4,"ayahStart":52,"surahEnd":4,"ayahEnd":59,"ayahCount":8,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":34,"rubEnd":35},{"page":88,"surahStart":4,"ayahStart":60,"surahEnd":4,"ayahEnd":65,"ayahCount":6,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":35,"rubEnd":35},{"page":89,"surahStart":4,"ayahStart":66,"surahEnd":4,"ayahEnd":74,"ayahCount":9,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":35,"rubEnd":36},{"page":90,"surahStart":4,"ayahStart":75,"surahEnd":4,"ayahEnd":79,"ayahCount":5,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":36,"rubEnd":36},{"page":91,"surahStart":4,"ayahStart":80,"surahEnd":4,"ayahEnd":86,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":9,"rubStart":36,"rubEnd":36},{"page":92,"surahStart":4,"ayahStart":87,"surahEnd":4,"ayahEnd":91,"ayahCount":5,"juzStart":5,"juzEnd":5,"hizbStart":9,"hizbEnd":10,"rubStart":36,"rubEnd":37},{"page":93,"surahStart":4,"ayahStart":92,"surahEnd":4,"ayahEnd":94,"ayahCount":3,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":37,"rubEnd":37},{"page":94,"surahStart":4,"ayahStart":95,"surahEnd":4,"ayahEnd":101,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":37,"rubEnd":38},{"page":95,"surahStart":4,"ayahStart":102,"surahEnd":4,"ayahEnd":105,"ayahCount":4,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":38,"rubEnd":38},{"page":96,"surahStart":4,"ayahStart":106,"surahEnd":4,"ayahEnd":113,"ayahCount":8,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":38,"rubEnd":38},{"page":97,"surahStart":4,"ayahStart":114,"surahEnd":4,"ayahEnd":121,"ayahCount":8,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":39,"rubEnd":39},{"page":98,"surahStart":4,"ayahStart":122,"surahEnd":4,"ayahEnd":127,"ayahCount":6,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":39,"rubEnd":39},{"page":99,"surahStart":4,"ayahStart":128,"surahEnd":4,"ayahEnd":134,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":39,"rubEnd":39},{"page":100,"surahStart":4,"ayahStart":135,"surahEnd":4,"ayahEnd":140,"ayahCount":6,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":40,"rubEnd":40},{"page":101,"surahStart":4,"ayahStart":141,"surahEnd":4,"ayahEnd":147,"ayahCount":7,"juzStart":5,"juzEnd":5,"hizbStart":10,"hizbEnd":10,"rubStart":40,"rubEnd":40},{"page":102,"surahStart":4,"ayahStart":148,"surahEnd":4,"ayahEnd":154,"ayahCount":7,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":41,"rubEnd":41},{"page":103,"surahStart":4,"ayahStart":155,"surahEnd":4,"ayahEnd":162,"ayahCount":8,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":41,"rubEnd":41},{"page":104,"surahStart":4,"ayahStart":163,"surahEnd":4,"ayahEnd":170,"ayahCount":8,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":42,"rubEnd":42},{"page":105,"surahStart":4,"ayahStart":171,"surahEnd":4,"ayahEnd":175,"ayahCount":5,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":42,"rubEnd":42},{"page":106,"surahStart":4,"ayahStart":176,"surahEnd":5,"ayahEnd":2,"ayahCount":3,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":42,"rubEnd":43},{"page":107,"surahStart":5,"ayahStart":3,"surahEnd":5,"ayahEnd":5,"ayahCount":3,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":43,"rubEnd":43},{"page":108,"surahStart":5,"ayahStart":6,"surahEnd":5,"ayahEnd":9,"ayahCount":4,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":43,"rubEnd":43},{"page":109,"surahStart":5,"ayahStart":10,"surahEnd":5,"ayahEnd":13,"ayahCount":4,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":43,"rubEnd":44},{"page":110,"surahStart":5,"ayahStart":14,"surahEnd":5,"ayahEnd":17,"ayahCount":4,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":44,"rubEnd":44},{"page":111,"surahStart":5,"ayahStart":18,"surahEnd":5,"ayahEnd":23,"ayahCount":6,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":11,"rubStart":44,"rubEnd":44},{"page":112,"surahStart":5,"ayahStart":24,"surahEnd":5,"ayahEnd":31,"ayahCount":8,"juzStart":6,"juzEnd":6,"hizbStart":11,"hizbEnd":12,"rubStart":44,"rubEnd":45},{"page":113,"surahStart":5,"ayahStart":32,"surahEnd":5,"ayahEnd":36,"ayahCount":5,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":45,"rubEnd":45},{"page":114,"surahStart":5,"ayahStart":37,"surahEnd":5,"ayahEnd":41,"ayahCount":5,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":45,"rubEnd":46},{"page":115,"surahStart":5,"ayahStart":42,"surahEnd":5,"ayahEnd":45,"ayahCount":4,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":46,"rubEnd":46},{"page":116,"surahStart":5,"ayahStart":46,"surahEnd":5,"ayahEnd":50,"ayahCount":5,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":46,"rubEnd":46},{"page":117,"surahStart":5,"ayahStart":51,"surahEnd":5,"ayahEnd":57,"ayahCount":7,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":47,"rubEnd":47},{"page":118,"surahStart":5,"ayahStart":58,"surahEnd":5,"ayahEnd":64,"ayahCount":7,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":47,"rubEnd":47},{"page":119,"surahStart":5,"ayahStart":65,"surahEnd":5,"ayahEnd":70,"ayahCount":6,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":47,"rubEnd":48},{"page":120,"surahStart":5,"ayahStart":71,"surahEnd":5,"ayahEnd":76,"ayahCount":6,"juzStart":6,"juzEnd":6,"hizbStart":12,"hizbEnd":12,"rubStart":48,"rubEnd":48},{"page":121,"surahStart":5,"ayahStart":77,"surahEnd":5,"ayahEnd":82,"ayahCount":6,"juzStart":6,"juzEnd":7,"hizbStart":12,"hizbEnd":13,"rubStart":48,"rubEnd":49},{"page":122,"surahStart":5,"ayahStart":83,"surahEnd":5,"ayahEnd":89,"ayahCount":7,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":49,"rubEnd":49},{"page":123,"surahStart":5,"ayahStart":90,"surahEnd":5,"ayahEnd":95,"ayahCount":6,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":49,"rubEnd":49},{"page":124,"surahStart":5,"ayahStart":96,"surahEnd":5,"ayahEnd":103,"ayahCount":8,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":49,"rubEnd":50},{"page":125,"surahStart":5,"ayahStart":104,"surahEnd":5,"ayahEnd":108,"ayahCount":5,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":50,"rubEnd":50},{"page":126,"surahStart":5,"ayahStart":109,"surahEnd":5,"ayahEnd":113,"ayahCount":5,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":51,"rubEnd":51},{"page":127,"surahStart":5,"ayahStart":114,"surahEnd":5,"ayahEnd":120,"ayahCount":7,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":51,"rubEnd":51},{"page":128,"surahStart":6,"ayahStart":1,"surahEnd":6,"ayahEnd":8,"ayahCount":8,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":51,"rubEnd":51},{"page":129,"surahStart":6,"ayahStart":9,"surahEnd":6,"ayahEnd":18,"ayahCount":10,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":51,"rubEnd":52},{"page":130,"surahStart":6,"ayahStart":19,"surahEnd":6,"ayahEnd":27,"ayahCount":9,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":52,"rubEnd":52},{"page":131,"surahStart":6,"ayahStart":28,"surahEnd":6,"ayahEnd":35,"ayahCount":8,"juzStart":7,"juzEnd":7,"hizbStart":13,"hizbEnd":13,"rubStart":52,"rubEnd":52},{"page":132,"surahStart":6,"ayahStart":36,"surahEnd":6,"ayahEnd":44,"ayahCount":9,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":53,"rubEnd":53},{"page":133,"surahStart":6,"ayahStart":45,"surahEnd":6,"ayahEnd":52,"ayahCount":8,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":53,"rubEnd":53},{"page":134,"surahStart":6,"ayahStart":53,"surahEnd":6,"ayahEnd":59,"ayahCount":7,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":53,"rubEnd":54},{"page":135,"surahStart":6,"ayahStart":60,"surahEnd":6,"ayahEnd":68,"ayahCount":9,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":54,"rubEnd":54},{"page":136,"surahStart":6,"ayahStart":69,"surahEnd":6,"ayahEnd":73,"ayahCount":5,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":54,"rubEnd":54},{"page":137,"surahStart":6,"ayahStart":74,"surahEnd":6,"ayahEnd":81,"ayahCount":8,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":55,"rubEnd":55},{"page":138,"surahStart":6,"ayahStart":82,"surahEnd":6,"ayahEnd":90,"ayahCount":9,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":55,"rubEnd":55},{"page":139,"surahStart":6,"ayahStart":91,"surahEnd":6,"ayahEnd":94,"ayahCount":4,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":55,"rubEnd":55},{"page":140,"surahStart":6,"ayahStart":95,"surahEnd":6,"ayahEnd":101,"ayahCount":7,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":56,"rubEnd":56},{"page":141,"surahStart":6,"ayahStart":102,"surahEnd":6,"ayahEnd":110,"ayahCount":9,"juzStart":7,"juzEnd":7,"hizbStart":14,"hizbEnd":14,"rubStart":56,"rubEnd":56},{"page":142,"surahStart":6,"ayahStart":111,"surahEnd":6,"ayahEnd":118,"ayahCount":8,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":57,"rubEnd":57},{"page":143,"surahStart":6,"ayahStart":119,"surahEnd":6,"ayahEnd":124,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":57,"rubEnd":57},{"page":144,"surahStart":6,"ayahStart":125,"surahEnd":6,"ayahEnd":131,"ayahCount":7,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":57,"rubEnd":58},{"page":145,"surahStart":6,"ayahStart":132,"surahEnd":6,"ayahEnd":137,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":58,"rubEnd":58},{"page":146,"surahStart":6,"ayahStart":138,"surahEnd":6,"ayahEnd":142,"ayahCount":5,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":58,"rubEnd":59},{"page":147,"surahStart":6,"ayahStart":143,"surahEnd":6,"ayahEnd":146,"ayahCount":4,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":59,"rubEnd":59},{"page":148,"surahStart":6,"ayahStart":147,"surahEnd":6,"ayahEnd":151,"ayahCount":5,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":59,"rubEnd":60},{"page":149,"surahStart":6,"ayahStart":152,"surahEnd":6,"ayahEnd":157,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":60,"rubEnd":60},{"page":150,"surahStart":6,"ayahStart":158,"surahEnd":6,"ayahEnd":165,"ayahCount":8,"juzStart":8,"juzEnd":8,"hizbStart":15,"hizbEnd":15,"rubStart":60,"rubEnd":60},{"page":151,"surahStart":7,"ayahStart":1,"surahEnd":7,"ayahEnd":11,"ayahCount":11,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":61,"rubEnd":61},{"page":152,"surahStart":7,"ayahStart":12,"surahEnd":7,"ayahEnd":22,"ayahCount":11,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":61,"rubEnd":61},{"page":153,"surahStart":7,"ayahStart":23,"surahEnd":7,"ayahEnd":30,"ayahCount":8,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":61,"rubEnd":61},{"page":154,"surahStart":7,"ayahStart":31,"surahEnd":7,"ayahEnd":37,"ayahCount":7,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":62,"rubEnd":62},{"page":155,"surahStart":7,"ayahStart":38,"surahEnd":7,"ayahEnd":43,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":62,"rubEnd":62},{"page":156,"surahStart":7,"ayahStart":44,"surahEnd":7,"ayahEnd":51,"ayahCount":8,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":62,"rubEnd":63},{"page":157,"surahStart":7,"ayahStart":52,"surahEnd":7,"ayahEnd":57,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":63,"rubEnd":63},{"page":158,"surahStart":7,"ayahStart":58,"surahEnd":7,"ayahEnd":67,"ayahCount":10,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":63,"rubEnd":64},{"page":159,"surahStart":7,"ayahStart":68,"surahEnd":7,"ayahEnd":73,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":64,"rubEnd":64},{"page":160,"surahStart":7,"ayahStart":74,"surahEnd":7,"ayahEnd":81,"ayahCount":8,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":64,"rubEnd":64},{"page":161,"surahStart":7,"ayahStart":82,"surahEnd":7,"ayahEnd":87,"ayahCount":6,"juzStart":8,"juzEnd":8,"hizbStart":16,"hizbEnd":16,"rubStart":64,"rubEnd":64},{"page":162,"surahStart":7,"ayahStart":88,"surahEnd":7,"ayahEnd":95,"ayahCount":8,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":65,"rubEnd":65},{"page":163,"surahStart":7,"ayahStart":96,"surahEnd":7,"ayahEnd":104,"ayahCount":9,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":65,"rubEnd":65},{"page":164,"surahStart":7,"ayahStart":105,"surahEnd":7,"ayahEnd":120,"ayahCount":16,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":65,"rubEnd":66},{"page":165,"surahStart":7,"ayahStart":121,"surahEnd":7,"ayahEnd":130,"ayahCount":10,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":66,"rubEnd":66},{"page":166,"surahStart":7,"ayahStart":131,"surahEnd":7,"ayahEnd":137,"ayahCount":7,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":66,"rubEnd":66},{"page":167,"surahStart":7,"ayahStart":138,"surahEnd":7,"ayahEnd":143,"ayahCount":6,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":66,"rubEnd":67},{"page":168,"surahStart":7,"ayahStart":144,"surahEnd":7,"ayahEnd":149,"ayahCount":6,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":67,"rubEnd":67},{"page":169,"surahStart":7,"ayahStart":150,"surahEnd":7,"ayahEnd":155,"ayahCount":6,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":67,"rubEnd":67},{"page":170,"surahStart":7,"ayahStart":156,"surahEnd":7,"ayahEnd":159,"ayahCount":4,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":68,"rubEnd":68},{"page":171,"surahStart":7,"ayahStart":160,"surahEnd":7,"ayahEnd":163,"ayahCount":4,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":68,"rubEnd":68},{"page":172,"surahStart":7,"ayahStart":164,"surahEnd":7,"ayahEnd":170,"ayahCount":7,"juzStart":9,"juzEnd":9,"hizbStart":17,"hizbEnd":17,"rubStart":68,"rubEnd":68},{"page":173,"surahStart":7,"ayahStart":171,"surahEnd":7,"ayahEnd":178,"ayahCount":8,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":69,"rubEnd":69},{"page":174,"surahStart":7,"ayahStart":179,"surahEnd":7,"ayahEnd":187,"ayahCount":9,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":69,"rubEnd":69},{"page":175,"surahStart":7,"ayahStart":188,"surahEnd":7,"ayahEnd":195,"ayahCount":8,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":69,"rubEnd":70},{"page":176,"surahStart":7,"ayahStart":196,"surahEnd":7,"ayahEnd":206,"ayahCount":11,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":70,"rubEnd":70},{"page":177,"surahStart":8,"ayahStart":1,"surahEnd":8,"ayahEnd":8,"ayahCount":8,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":71,"rubEnd":71},{"page":178,"surahStart":8,"ayahStart":9,"surahEnd":8,"ayahEnd":16,"ayahCount":8,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":71,"rubEnd":71},{"page":179,"surahStart":8,"ayahStart":17,"surahEnd":8,"ayahEnd":25,"ayahCount":9,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":71,"rubEnd":72},{"page":180,"surahStart":8,"ayahStart":26,"surahEnd":8,"ayahEnd":33,"ayahCount":8,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":72,"rubEnd":72},{"page":181,"surahStart":8,"ayahStart":34,"surahEnd":8,"ayahEnd":40,"ayahCount":7,"juzStart":9,"juzEnd":9,"hizbStart":18,"hizbEnd":18,"rubStart":72,"rubEnd":72},{"page":182,"surahStart":8,"ayahStart":41,"surahEnd":8,"ayahEnd":45,"ayahCount":5,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":73,"rubEnd":73},{"page":183,"surahStart":8,"ayahStart":46,"surahEnd":8,"ayahEnd":52,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":73,"rubEnd":73},{"page":184,"surahStart":8,"ayahStart":53,"surahEnd":8,"ayahEnd":61,"ayahCount":9,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":73,"rubEnd":74},{"page":185,"surahStart":8,"ayahStart":62,"surahEnd":8,"ayahEnd":69,"ayahCount":8,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":74,"rubEnd":74},{"page":186,"surahStart":8,"ayahStart":70,"surahEnd":8,"ayahEnd":75,"ayahCount":6,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":74,"rubEnd":74},{"page":187,"surahStart":9,"ayahStart":1,"surahEnd":9,"ayahEnd":6,"ayahCount":6,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":75,"rubEnd":75},{"page":188,"surahStart":9,"ayahStart":7,"surahEnd":9,"ayahEnd":13,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":75,"rubEnd":75},{"page":189,"surahStart":9,"ayahStart":14,"surahEnd":9,"ayahEnd":20,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":75,"rubEnd":76},{"page":190,"surahStart":9,"ayahStart":21,"surahEnd":9,"ayahEnd":26,"ayahCount":6,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":76,"rubEnd":76},{"page":191,"surahStart":9,"ayahStart":27,"surahEnd":9,"ayahEnd":31,"ayahCount":5,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":19,"rubStart":76,"rubEnd":76},{"page":192,"surahStart":9,"ayahStart":32,"surahEnd":9,"ayahEnd":36,"ayahCount":5,"juzStart":10,"juzEnd":10,"hizbStart":19,"hizbEnd":20,"rubStart":76,"rubEnd":77},{"page":193,"surahStart":9,"ayahStart":37,"surahEnd":9,"ayahEnd":40,"ayahCount":4,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":77,"rubEnd":77},{"page":194,"surahStart":9,"ayahStart":41,"surahEnd":9,"ayahEnd":47,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":77,"rubEnd":78},{"page":195,"surahStart":9,"ayahStart":48,"surahEnd":9,"ayahEnd":54,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":78,"rubEnd":78},{"page":196,"surahStart":9,"ayahStart":55,"surahEnd":9,"ayahEnd":61,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":78,"rubEnd":79},{"page":197,"surahStart":9,"ayahStart":62,"surahEnd":9,"ayahEnd":68,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":79,"rubEnd":79},{"page":198,"surahStart":9,"ayahStart":69,"surahEnd":9,"ayahEnd":72,"ayahCount":4,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":79,"rubEnd":79},{"page":199,"surahStart":9,"ayahStart":73,"surahEnd":9,"ayahEnd":79,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":79,"rubEnd":80},{"page":200,"surahStart":9,"ayahStart":80,"surahEnd":9,"ayahEnd":86,"ayahCount":7,"juzStart":10,"juzEnd":10,"hizbStart":20,"hizbEnd":20,"rubStart":80,"rubEnd":80},{"page":201,"surahStart":9,"ayahStart":87,"surahEnd":9,"ayahEnd":93,"ayahCount":7,"juzStart":10,"juzEnd":11,"hizbStart":20,"hizbEnd":21,"rubStart":80,"rubEnd":81},{"page":202,"surahStart":9,"ayahStart":94,"surahEnd":9,"ayahEnd":99,"ayahCount":6,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":81,"rubEnd":81},{"page":203,"surahStart":9,"ayahStart":100,"surahEnd":9,"ayahEnd":106,"ayahCount":7,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":81,"rubEnd":81},{"page":204,"surahStart":9,"ayahStart":107,"surahEnd":9,"ayahEnd":111,"ayahCount":5,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":81,"rubEnd":82},{"page":205,"surahStart":9,"ayahStart":112,"surahEnd":9,"ayahEnd":117,"ayahCount":6,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":82,"rubEnd":82},{"page":206,"surahStart":9,"ayahStart":118,"surahEnd":9,"ayahEnd":122,"ayahCount":5,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":82,"rubEnd":83},{"page":207,"surahStart":9,"ayahStart":123,"surahEnd":9,"ayahEnd":129,"ayahCount":7,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":83,"rubEnd":83},{"page":208,"surahStart":10,"ayahStart":1,"surahEnd":10,"ayahEnd":6,"ayahCount":6,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":83,"rubEnd":83},{"page":209,"surahStart":10,"ayahStart":7,"surahEnd":10,"ayahEnd":14,"ayahCount":8,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":83,"rubEnd":84},{"page":210,"surahStart":10,"ayahStart":15,"surahEnd":10,"ayahEnd":20,"ayahCount":6,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":84,"rubEnd":84},{"page":211,"surahStart":10,"ayahStart":21,"surahEnd":10,"ayahEnd":25,"ayahCount":5,"juzStart":11,"juzEnd":11,"hizbStart":21,"hizbEnd":21,"rubStart":84,"rubEnd":84},{"page":212,"surahStart":10,"ayahStart":26,"surahEnd":10,"ayahEnd":33,"ayahCount":8,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":85,"rubEnd":85},{"page":213,"surahStart":10,"ayahStart":34,"surahEnd":10,"ayahEnd":42,"ayahCount":9,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":85,"rubEnd":85},{"page":214,"surahStart":10,"ayahStart":43,"surahEnd":10,"ayahEnd":53,"ayahCount":11,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":85,"rubEnd":86},{"page":215,"surahStart":10,"ayahStart":54,"surahEnd":10,"ayahEnd":61,"ayahCount":8,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":86,"rubEnd":86},{"page":216,"surahStart":10,"ayahStart":62,"surahEnd":10,"ayahEnd":70,"ayahCount":9,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":86,"rubEnd":86},{"page":217,"surahStart":10,"ayahStart":71,"surahEnd":10,"ayahEnd":78,"ayahCount":8,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":87,"rubEnd":87},{"page":218,"surahStart":10,"ayahStart":79,"surahEnd":10,"ayahEnd":88,"ayahCount":10,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":87,"rubEnd":87},{"page":219,"surahStart":10,"ayahStart":89,"surahEnd":10,"ayahEnd":97,"ayahCount":9,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":87,"rubEnd":88},{"page":220,"surahStart":10,"ayahStart":98,"surahEnd":10,"ayahEnd":106,"ayahCount":9,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":88,"rubEnd":88},{"page":221,"surahStart":10,"ayahStart":107,"surahEnd":11,"ayahEnd":5,"ayahCount":8,"juzStart":11,"juzEnd":11,"hizbStart":22,"hizbEnd":22,"rubStart":88,"rubEnd":88},{"page":222,"surahStart":11,"ayahStart":6,"surahEnd":11,"ayahEnd":12,"ayahCount":7,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":89,"rubEnd":89},{"page":223,"surahStart":11,"ayahStart":13,"surahEnd":11,"ayahEnd":19,"ayahCount":7,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":89,"rubEnd":89},{"page":224,"surahStart":11,"ayahStart":20,"surahEnd":11,"ayahEnd":28,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":89,"rubEnd":90},{"page":225,"surahStart":11,"ayahStart":29,"surahEnd":11,"ayahEnd":37,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":90,"rubEnd":90},{"page":226,"surahStart":11,"ayahStart":38,"surahEnd":11,"ayahEnd":45,"ayahCount":8,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":90,"rubEnd":91},{"page":227,"surahStart":11,"ayahStart":46,"surahEnd":11,"ayahEnd":53,"ayahCount":8,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":91,"rubEnd":91},{"page":228,"surahStart":11,"ayahStart":54,"surahEnd":11,"ayahEnd":62,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":91,"rubEnd":92},{"page":229,"surahStart":11,"ayahStart":63,"surahEnd":11,"ayahEnd":71,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":92,"rubEnd":92},{"page":230,"surahStart":11,"ayahStart":72,"surahEnd":11,"ayahEnd":81,"ayahCount":10,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":23,"rubStart":92,"rubEnd":92},{"page":231,"surahStart":11,"ayahStart":82,"surahEnd":11,"ayahEnd":88,"ayahCount":7,"juzStart":12,"juzEnd":12,"hizbStart":23,"hizbEnd":24,"rubStart":92,"rubEnd":93},{"page":232,"surahStart":11,"ayahStart":89,"surahEnd":11,"ayahEnd":97,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":93,"rubEnd":93},{"page":233,"surahStart":11,"ayahStart":98,"surahEnd":11,"ayahEnd":108,"ayahCount":11,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":93,"rubEnd":94},{"page":234,"surahStart":11,"ayahStart":109,"surahEnd":11,"ayahEnd":117,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":94,"rubEnd":94},{"page":235,"surahStart":11,"ayahStart":118,"surahEnd":12,"ayahEnd":4,"ayahCount":10,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":94,"rubEnd":94},{"page":236,"surahStart":12,"ayahStart":5,"surahEnd":12,"ayahEnd":14,"ayahCount":10,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":94,"rubEnd":95},{"page":237,"surahStart":12,"ayahStart":15,"surahEnd":12,"ayahEnd":22,"ayahCount":8,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":95,"rubEnd":95},{"page":238,"surahStart":12,"ayahStart":23,"surahEnd":12,"ayahEnd":30,"ayahCount":8,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":95,"rubEnd":96},{"page":239,"surahStart":12,"ayahStart":31,"surahEnd":12,"ayahEnd":37,"ayahCount":7,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":96,"rubEnd":96},{"page":240,"surahStart":12,"ayahStart":38,"surahEnd":12,"ayahEnd":43,"ayahCount":6,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":96,"rubEnd":96},{"page":241,"surahStart":12,"ayahStart":44,"surahEnd":12,"ayahEnd":52,"ayahCount":9,"juzStart":12,"juzEnd":12,"hizbStart":24,"hizbEnd":24,"rubStart":96,"rubEnd":96},{"page":242,"surahStart":12,"ayahStart":53,"surahEnd":12,"ayahEnd":63,"ayahCount":11,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":97,"rubEnd":97},{"page":243,"surahStart":12,"ayahStart":64,"surahEnd":12,"ayahEnd":69,"ayahCount":6,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":97,"rubEnd":97},{"page":244,"surahStart":12,"ayahStart":70,"surahEnd":12,"ayahEnd":78,"ayahCount":9,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":97,"rubEnd":98},{"page":245,"surahStart":12,"ayahStart":79,"surahEnd":12,"ayahEnd":86,"ayahCount":8,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":98,"rubEnd":98},{"page":246,"surahStart":12,"ayahStart":87,"surahEnd":12,"ayahEnd":95,"ayahCount":9,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":98,"rubEnd":98},{"page":247,"surahStart":12,"ayahStart":96,"surahEnd":12,"ayahEnd":103,"ayahCount":8,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":98,"rubEnd":99},{"page":248,"surahStart":12,"ayahStart":104,"surahEnd":12,"ayahEnd":111,"ayahCount":8,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":99,"rubEnd":99},{"page":249,"surahStart":13,"ayahStart":1,"surahEnd":13,"ayahEnd":5,"ayahCount":5,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":99,"rubEnd":100},{"page":250,"surahStart":13,"ayahStart":6,"surahEnd":13,"ayahEnd":13,"ayahCount":8,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":100,"rubEnd":100},{"page":251,"surahStart":13,"ayahStart":14,"surahEnd":13,"ayahEnd":18,"ayahCount":5,"juzStart":13,"juzEnd":13,"hizbStart":25,"hizbEnd":25,"rubStart":100,"rubEnd":100},{"page":252,"surahStart":13,"ayahStart":19,"surahEnd":13,"ayahEnd":28,"ayahCount":10,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":101,"rubEnd":101},{"page":253,"surahStart":13,"ayahStart":29,"surahEnd":13,"ayahEnd":34,"ayahCount":6,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":101,"rubEnd":101},{"page":254,"surahStart":13,"ayahStart":35,"surahEnd":13,"ayahEnd":42,"ayahCount":8,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":102,"rubEnd":102},{"page":255,"surahStart":13,"ayahStart":43,"surahEnd":14,"ayahEnd":5,"ayahCount":6,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":102,"rubEnd":102},{"page":256,"surahStart":14,"ayahStart":6,"surahEnd":14,"ayahEnd":10,"ayahCount":5,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":102,"rubEnd":103},{"page":257,"surahStart":14,"ayahStart":11,"surahEnd":14,"ayahEnd":18,"ayahCount":8,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":103,"rubEnd":103},{"page":258,"surahStart":14,"ayahStart":19,"surahEnd":14,"ayahEnd":24,"ayahCount":6,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":103,"rubEnd":103},{"page":259,"surahStart":14,"ayahStart":25,"surahEnd":14,"ayahEnd":33,"ayahCount":9,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":103,"rubEnd":104},{"page":260,"surahStart":14,"ayahStart":34,"surahEnd":14,"ayahEnd":42,"ayahCount":9,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":104,"rubEnd":104},{"page":261,"surahStart":14,"ayahStart":43,"surahEnd":14,"ayahEnd":52,"ayahCount":10,"juzStart":13,"juzEnd":13,"hizbStart":26,"hizbEnd":26,"rubStart":104,"rubEnd":104},{"page":262,"surahStart":15,"ayahStart":1,"surahEnd":15,"ayahEnd":15,"ayahCount":15,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":105,"rubEnd":105},{"page":263,"surahStart":15,"ayahStart":16,"surahEnd":15,"ayahEnd":31,"ayahCount":16,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":105,"rubEnd":105},{"page":264,"surahStart":15,"ayahStart":32,"surahEnd":15,"ayahEnd":51,"ayahCount":20,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":105,"rubEnd":106},{"page":265,"surahStart":15,"ayahStart":52,"surahEnd":15,"ayahEnd":70,"ayahCount":19,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":106,"rubEnd":106},{"page":266,"surahStart":15,"ayahStart":71,"surahEnd":15,"ayahEnd":90,"ayahCount":20,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":106,"rubEnd":106},{"page":267,"surahStart":15,"ayahStart":91,"surahEnd":16,"ayahEnd":6,"ayahCount":15,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":106,"rubEnd":107},{"page":268,"surahStart":16,"ayahStart":7,"surahEnd":16,"ayahEnd":14,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":107,"rubEnd":107},{"page":269,"surahStart":16,"ayahStart":15,"surahEnd":16,"ayahEnd":26,"ayahCount":12,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":107,"rubEnd":107},{"page":270,"surahStart":16,"ayahStart":27,"surahEnd":16,"ayahEnd":34,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":107,"rubEnd":108},{"page":271,"surahStart":16,"ayahStart":35,"surahEnd":16,"ayahEnd":42,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":27,"rubStart":108,"rubEnd":108},{"page":272,"surahStart":16,"ayahStart":43,"surahEnd":16,"ayahEnd":54,"ayahCount":12,"juzStart":14,"juzEnd":14,"hizbStart":27,"hizbEnd":28,"rubStart":108,"rubEnd":109},{"page":273,"surahStart":16,"ayahStart":55,"surahEnd":16,"ayahEnd":64,"ayahCount":10,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":109,"rubEnd":109},{"page":274,"surahStart":16,"ayahStart":65,"surahEnd":16,"ayahEnd":72,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":109,"rubEnd":109},{"page":275,"surahStart":16,"ayahStart":73,"surahEnd":16,"ayahEnd":79,"ayahCount":7,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":109,"rubEnd":110},{"page":276,"surahStart":16,"ayahStart":80,"surahEnd":16,"ayahEnd":87,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":110,"rubEnd":110},{"page":277,"surahStart":16,"ayahStart":88,"surahEnd":16,"ayahEnd":93,"ayahCount":6,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":110,"rubEnd":111},{"page":278,"surahStart":16,"ayahStart":94,"surahEnd":16,"ayahEnd":102,"ayahCount":9,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":111,"rubEnd":111},{"page":279,"surahStart":16,"ayahStart":103,"surahEnd":16,"ayahEnd":110,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":111,"rubEnd":111},{"page":280,"surahStart":16,"ayahStart":111,"surahEnd":16,"ayahEnd":118,"ayahCount":8,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":112,"rubEnd":112},{"page":281,"surahStart":16,"ayahStart":119,"surahEnd":16,"ayahEnd":128,"ayahCount":10,"juzStart":14,"juzEnd":14,"hizbStart":28,"hizbEnd":28,"rubStart":112,"rubEnd":112},{"page":282,"surahStart":17,"ayahStart":1,"surahEnd":17,"ayahEnd":7,"ayahCount":7,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":113,"rubEnd":113},{"page":283,"surahStart":17,"ayahStart":8,"surahEnd":17,"ayahEnd":17,"ayahCount":10,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":113,"rubEnd":113},{"page":284,"surahStart":17,"ayahStart":18,"surahEnd":17,"ayahEnd":27,"ayahCount":10,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":113,"rubEnd":114},{"page":285,"surahStart":17,"ayahStart":28,"surahEnd":17,"ayahEnd":38,"ayahCount":11,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":114,"rubEnd":114},{"page":286,"surahStart":17,"ayahStart":39,"surahEnd":17,"ayahEnd":49,"ayahCount":11,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":114,"rubEnd":114},{"page":287,"surahStart":17,"ayahStart":50,"surahEnd":17,"ayahEnd":58,"ayahCount":9,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":115,"rubEnd":115},{"page":288,"surahStart":17,"ayahStart":59,"surahEnd":17,"ayahEnd":66,"ayahCount":8,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":115,"rubEnd":115},{"page":289,"surahStart":17,"ayahStart":67,"surahEnd":17,"ayahEnd":75,"ayahCount":9,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":115,"rubEnd":116},{"page":290,"surahStart":17,"ayahStart":76,"surahEnd":17,"ayahEnd":86,"ayahCount":11,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":116,"rubEnd":116},{"page":291,"surahStart":17,"ayahStart":87,"surahEnd":17,"ayahEnd":96,"ayahCount":10,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":29,"rubStart":116,"rubEnd":116},{"page":292,"surahStart":17,"ayahStart":97,"surahEnd":17,"ayahEnd":104,"ayahCount":8,"juzStart":15,"juzEnd":15,"hizbStart":29,"hizbEnd":30,"rubStart":116,"rubEnd":117},{"page":293,"surahStart":17,"ayahStart":105,"surahEnd":18,"ayahEnd":4,"ayahCount":11,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":117,"rubEnd":117},{"page":294,"surahStart":18,"ayahStart":5,"surahEnd":18,"ayahEnd":15,"ayahCount":11,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":117,"rubEnd":117},{"page":295,"surahStart":18,"ayahStart":16,"surahEnd":18,"ayahEnd":20,"ayahCount":5,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":117,"rubEnd":118},{"page":296,"surahStart":18,"ayahStart":21,"surahEnd":18,"ayahEnd":27,"ayahCount":7,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":118,"rubEnd":118},{"page":297,"surahStart":18,"ayahStart":28,"surahEnd":18,"ayahEnd":34,"ayahCount":7,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":118,"rubEnd":119},{"page":298,"surahStart":18,"ayahStart":35,"surahEnd":18,"ayahEnd":45,"ayahCount":11,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":119,"rubEnd":119},{"page":299,"surahStart":18,"ayahStart":46,"surahEnd":18,"ayahEnd":53,"ayahCount":8,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":119,"rubEnd":120},{"page":300,"surahStart":18,"ayahStart":54,"surahEnd":18,"ayahEnd":61,"ayahCount":8,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":120,"rubEnd":120},{"page":301,"surahStart":18,"ayahStart":62,"surahEnd":18,"ayahEnd":74,"ayahCount":13,"juzStart":15,"juzEnd":15,"hizbStart":30,"hizbEnd":30,"rubStart":120,"rubEnd":120},{"page":302,"surahStart":18,"ayahStart":75,"surahEnd":18,"ayahEnd":83,"ayahCount":9,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":121,"rubEnd":121},{"page":303,"surahStart":18,"ayahStart":84,"surahEnd":18,"ayahEnd":97,"ayahCount":14,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":121,"rubEnd":121},{"page":304,"surahStart":18,"ayahStart":98,"surahEnd":18,"ayahEnd":110,"ayahCount":13,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":121,"rubEnd":122},{"page":305,"surahStart":19,"ayahStart":1,"surahEnd":19,"ayahEnd":11,"ayahCount":11,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":122,"rubEnd":122},{"page":306,"surahStart":19,"ayahStart":12,"surahEnd":19,"ayahEnd":25,"ayahCount":14,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":122,"rubEnd":123},{"page":307,"surahStart":19,"ayahStart":26,"surahEnd":19,"ayahEnd":38,"ayahCount":13,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":123,"rubEnd":123},{"page":308,"surahStart":19,"ayahStart":39,"surahEnd":19,"ayahEnd":51,"ayahCount":13,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":123,"rubEnd":123},{"page":309,"surahStart":19,"ayahStart":52,"surahEnd":19,"ayahEnd":64,"ayahCount":13,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":123,"rubEnd":124},{"page":310,"surahStart":19,"ayahStart":65,"surahEnd":19,"ayahEnd":76,"ayahCount":12,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":124,"rubEnd":124},{"page":311,"surahStart":19,"ayahStart":77,"surahEnd":19,"ayahEnd":95,"ayahCount":19,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":31,"rubStart":124,"rubEnd":124},{"page":312,"surahStart":19,"ayahStart":96,"surahEnd":20,"ayahEnd":12,"ayahCount":15,"juzStart":16,"juzEnd":16,"hizbStart":31,"hizbEnd":32,"rubStart":124,"rubEnd":125},{"page":313,"surahStart":20,"ayahStart":13,"surahEnd":20,"ayahEnd":37,"ayahCount":25,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":125,"rubEnd":125},{"page":314,"surahStart":20,"ayahStart":38,"surahEnd":20,"ayahEnd":51,"ayahCount":14,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":125,"rubEnd":125},{"page":315,"surahStart":20,"ayahStart":52,"surahEnd":20,"ayahEnd":64,"ayahCount":13,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":125,"rubEnd":126},{"page":316,"surahStart":20,"ayahStart":65,"surahEnd":20,"ayahEnd":76,"ayahCount":12,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":126,"rubEnd":126},{"page":317,"surahStart":20,"ayahStart":77,"surahEnd":20,"ayahEnd":87,"ayahCount":11,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":126,"rubEnd":127},{"page":318,"surahStart":20,"ayahStart":88,"surahEnd":20,"ayahEnd":98,"ayahCount":11,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":127,"rubEnd":127},{"page":319,"surahStart":20,"ayahStart":99,"surahEnd":20,"ayahEnd":113,"ayahCount":15,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":127,"rubEnd":128},{"page":320,"surahStart":20,"ayahStart":114,"surahEnd":20,"ayahEnd":125,"ayahCount":12,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":128,"rubEnd":128},{"page":321,"surahStart":20,"ayahStart":126,"surahEnd":20,"ayahEnd":135,"ayahCount":10,"juzStart":16,"juzEnd":16,"hizbStart":32,"hizbEnd":32,"rubStart":128,"rubEnd":128},{"page":322,"surahStart":21,"ayahStart":1,"surahEnd":21,"ayahEnd":10,"ayahCount":10,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":129,"rubEnd":129},{"page":323,"surahStart":21,"ayahStart":11,"surahEnd":21,"ayahEnd":24,"ayahCount":14,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":129,"rubEnd":129},{"page":324,"surahStart":21,"ayahStart":25,"surahEnd":21,"ayahEnd":35,"ayahCount":11,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":129,"rubEnd":130},{"page":325,"surahStart":21,"ayahStart":36,"surahEnd":21,"ayahEnd":44,"ayahCount":9,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":130,"rubEnd":130},{"page":326,"surahStart":21,"ayahStart":45,"surahEnd":21,"ayahEnd":57,"ayahCount":13,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":130,"rubEnd":131},{"page":327,"surahStart":21,"ayahStart":58,"surahEnd":21,"ayahEnd":72,"ayahCount":15,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":131,"rubEnd":131},{"page":328,"surahStart":21,"ayahStart":73,"surahEnd":21,"ayahEnd":81,"ayahCount":9,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":131,"rubEnd":131},{"page":329,"surahStart":21,"ayahStart":82,"surahEnd":21,"ayahEnd":90,"ayahCount":9,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":131,"rubEnd":132},{"page":330,"surahStart":21,"ayahStart":91,"surahEnd":21,"ayahEnd":101,"ayahCount":11,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":132,"rubEnd":132},{"page":331,"surahStart":21,"ayahStart":102,"surahEnd":21,"ayahEnd":112,"ayahCount":11,"juzStart":17,"juzEnd":17,"hizbStart":33,"hizbEnd":33,"rubStart":132,"rubEnd":132},{"page":332,"surahStart":22,"ayahStart":1,"surahEnd":22,"ayahEnd":5,"ayahCount":5,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":133,"rubEnd":133},{"page":333,"surahStart":22,"ayahStart":6,"surahEnd":22,"ayahEnd":15,"ayahCount":10,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":133,"rubEnd":133},{"page":334,"surahStart":22,"ayahStart":16,"surahEnd":22,"ayahEnd":23,"ayahCount":8,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":133,"rubEnd":134},{"page":335,"surahStart":22,"ayahStart":24,"surahEnd":22,"ayahEnd":30,"ayahCount":7,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":134,"rubEnd":134},{"page":336,"surahStart":22,"ayahStart":31,"surahEnd":22,"ayahEnd":38,"ayahCount":8,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":134,"rubEnd":135},{"page":337,"surahStart":22,"ayahStart":39,"surahEnd":22,"ayahEnd":46,"ayahCount":8,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":135,"rubEnd":135},{"page":338,"surahStart":22,"ayahStart":47,"surahEnd":22,"ayahEnd":55,"ayahCount":9,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":135,"rubEnd":135},{"page":339,"surahStart":22,"ayahStart":56,"surahEnd":22,"ayahEnd":64,"ayahCount":9,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":135,"rubEnd":136},{"page":340,"surahStart":22,"ayahStart":65,"surahEnd":22,"ayahEnd":72,"ayahCount":8,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":136,"rubEnd":136},{"page":341,"surahStart":22,"ayahStart":73,"surahEnd":22,"ayahEnd":78,"ayahCount":6,"juzStart":17,"juzEnd":17,"hizbStart":34,"hizbEnd":34,"rubStart":136,"rubEnd":136},{"page":342,"surahStart":23,"ayahStart":1,"surahEnd":23,"ayahEnd":17,"ayahCount":17,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":137,"rubEnd":137},{"page":343,"surahStart":23,"ayahStart":18,"surahEnd":23,"ayahEnd":27,"ayahCount":10,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":137,"rubEnd":137},{"page":344,"surahStart":23,"ayahStart":28,"surahEnd":23,"ayahEnd":42,"ayahCount":15,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":137,"rubEnd":138},{"page":345,"surahStart":23,"ayahStart":43,"surahEnd":23,"ayahEnd":59,"ayahCount":17,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":138,"rubEnd":138},{"page":346,"surahStart":23,"ayahStart":60,"surahEnd":23,"ayahEnd":74,"ayahCount":15,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":138,"rubEnd":138},{"page":347,"surahStart":23,"ayahStart":75,"surahEnd":23,"ayahEnd":89,"ayahCount":15,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":139,"rubEnd":139},{"page":348,"surahStart":23,"ayahStart":90,"surahEnd":23,"ayahEnd":104,"ayahCount":15,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":139,"rubEnd":139},{"page":349,"surahStart":23,"ayahStart":105,"surahEnd":23,"ayahEnd":118,"ayahCount":14,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":139,"rubEnd":139},{"page":350,"surahStart":24,"ayahStart":1,"surahEnd":24,"ayahEnd":10,"ayahCount":10,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":140,"rubEnd":140},{"page":351,"surahStart":24,"ayahStart":11,"surahEnd":24,"ayahEnd":20,"ayahCount":10,"juzStart":18,"juzEnd":18,"hizbStart":35,"hizbEnd":35,"rubStart":140,"rubEnd":140},{"page":352,"surahStart":24,"ayahStart":21,"surahEnd":24,"ayahEnd":27,"ayahCount":7,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":141,"rubEnd":141},{"page":353,"surahStart":24,"ayahStart":28,"surahEnd":24,"ayahEnd":31,"ayahCount":4,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":141,"rubEnd":141},{"page":354,"surahStart":24,"ayahStart":32,"surahEnd":24,"ayahEnd":36,"ayahCount":5,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":141,"rubEnd":142},{"page":355,"surahStart":24,"ayahStart":37,"surahEnd":24,"ayahEnd":43,"ayahCount":7,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":142,"rubEnd":142},{"page":356,"surahStart":24,"ayahStart":44,"surahEnd":24,"ayahEnd":53,"ayahCount":10,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":142,"rubEnd":143},{"page":357,"surahStart":24,"ayahStart":54,"surahEnd":24,"ayahEnd":58,"ayahCount":5,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":143,"rubEnd":143},{"page":358,"surahStart":24,"ayahStart":59,"surahEnd":24,"ayahEnd":61,"ayahCount":3,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":143,"rubEnd":143},{"page":359,"surahStart":24,"ayahStart":62,"surahEnd":25,"ayahEnd":2,"ayahCount":5,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":143,"rubEnd":144},{"page":360,"surahStart":25,"ayahStart":3,"surahEnd":25,"ayahEnd":11,"ayahCount":9,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":144,"rubEnd":144},{"page":361,"surahStart":25,"ayahStart":12,"surahEnd":25,"ayahEnd":20,"ayahCount":9,"juzStart":18,"juzEnd":18,"hizbStart":36,"hizbEnd":36,"rubStart":144,"rubEnd":144},{"page":362,"surahStart":25,"ayahStart":21,"surahEnd":25,"ayahEnd":32,"ayahCount":12,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":145,"rubEnd":145},{"page":363,"surahStart":25,"ayahStart":33,"surahEnd":25,"ayahEnd":43,"ayahCount":11,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":145,"rubEnd":145},{"page":364,"surahStart":25,"ayahStart":44,"surahEnd":25,"ayahEnd":55,"ayahCount":12,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":145,"rubEnd":146},{"page":365,"surahStart":25,"ayahStart":56,"surahEnd":25,"ayahEnd":67,"ayahCount":12,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":146,"rubEnd":146},{"page":366,"surahStart":25,"ayahStart":68,"surahEnd":25,"ayahEnd":77,"ayahCount":10,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":146,"rubEnd":146},{"page":367,"surahStart":26,"ayahStart":1,"surahEnd":26,"ayahEnd":19,"ayahCount":19,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":147,"rubEnd":147},{"page":368,"surahStart":26,"ayahStart":20,"surahEnd":26,"ayahEnd":39,"ayahCount":20,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":147,"rubEnd":147},{"page":369,"surahStart":26,"ayahStart":40,"surahEnd":26,"ayahEnd":60,"ayahCount":21,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":147,"rubEnd":148},{"page":370,"surahStart":26,"ayahStart":61,"surahEnd":26,"ayahEnd":83,"ayahCount":23,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":37,"rubStart":148,"rubEnd":148},{"page":371,"surahStart":26,"ayahStart":84,"surahEnd":26,"ayahEnd":111,"ayahCount":28,"juzStart":19,"juzEnd":19,"hizbStart":37,"hizbEnd":38,"rubStart":148,"rubEnd":149},{"page":372,"surahStart":26,"ayahStart":112,"surahEnd":26,"ayahEnd":136,"ayahCount":25,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":149,"rubEnd":149},{"page":373,"surahStart":26,"ayahStart":137,"surahEnd":26,"ayahEnd":159,"ayahCount":23,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":149,"rubEnd":149},{"page":374,"surahStart":26,"ayahStart":160,"surahEnd":26,"ayahEnd":183,"ayahCount":24,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":149,"rubEnd":150},{"page":375,"surahStart":26,"ayahStart":184,"surahEnd":26,"ayahEnd":206,"ayahCount":23,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":150,"rubEnd":150},{"page":376,"surahStart":26,"ayahStart":207,"surahEnd":26,"ayahEnd":227,"ayahCount":21,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":150,"rubEnd":150},{"page":377,"surahStart":27,"ayahStart":1,"surahEnd":27,"ayahEnd":13,"ayahCount":13,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":151,"rubEnd":151},{"page":378,"surahStart":27,"ayahStart":14,"surahEnd":27,"ayahEnd":22,"ayahCount":9,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":151,"rubEnd":151},{"page":379,"surahStart":27,"ayahStart":23,"surahEnd":27,"ayahEnd":35,"ayahCount":13,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":151,"rubEnd":152},{"page":380,"surahStart":27,"ayahStart":36,"surahEnd":27,"ayahEnd":44,"ayahCount":9,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":152,"rubEnd":152},{"page":381,"surahStart":27,"ayahStart":45,"surahEnd":27,"ayahEnd":55,"ayahCount":11,"juzStart":19,"juzEnd":19,"hizbStart":38,"hizbEnd":38,"rubStart":152,"rubEnd":152},{"page":382,"surahStart":27,"ayahStart":56,"surahEnd":27,"ayahEnd":63,"ayahCount":8,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":153,"rubEnd":153},{"page":383,"surahStart":27,"ayahStart":64,"surahEnd":27,"ayahEnd":76,"ayahCount":13,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":153,"rubEnd":153},{"page":384,"surahStart":27,"ayahStart":77,"surahEnd":27,"ayahEnd":88,"ayahCount":12,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":153,"rubEnd":154},{"page":385,"surahStart":27,"ayahStart":89,"surahEnd":28,"ayahEnd":5,"ayahCount":10,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":154,"rubEnd":154},{"page":386,"surahStart":28,"ayahStart":6,"surahEnd":28,"ayahEnd":13,"ayahCount":8,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":154,"rubEnd":155},{"page":387,"surahStart":28,"ayahStart":14,"surahEnd":28,"ayahEnd":21,"ayahCount":8,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":155,"rubEnd":155},{"page":388,"surahStart":28,"ayahStart":22,"surahEnd":28,"ayahEnd":28,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":155,"rubEnd":155},{"page":389,"surahStart":28,"ayahStart":29,"surahEnd":28,"ayahEnd":35,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":156,"rubEnd":156},{"page":390,"surahStart":28,"ayahStart":36,"surahEnd":28,"ayahEnd":43,"ayahCount":8,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":156,"rubEnd":156},{"page":391,"surahStart":28,"ayahStart":44,"surahEnd":28,"ayahEnd":50,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":39,"hizbEnd":39,"rubStart":156,"rubEnd":156},{"page":392,"surahStart":28,"ayahStart":51,"surahEnd":28,"ayahEnd":59,"ayahCount":9,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":157,"rubEnd":157},{"page":393,"surahStart":28,"ayahStart":60,"surahEnd":28,"ayahEnd":70,"ayahCount":11,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":157,"rubEnd":157},{"page":394,"surahStart":28,"ayahStart":71,"surahEnd":28,"ayahEnd":77,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":157,"rubEnd":158},{"page":395,"surahStart":28,"ayahStart":78,"surahEnd":28,"ayahEnd":84,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":158,"rubEnd":158},{"page":396,"surahStart":28,"ayahStart":85,"surahEnd":29,"ayahEnd":6,"ayahCount":10,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":158,"rubEnd":159},{"page":397,"surahStart":29,"ayahStart":7,"surahEnd":29,"ayahEnd":14,"ayahCount":8,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":159,"rubEnd":159},{"page":398,"surahStart":29,"ayahStart":15,"surahEnd":29,"ayahEnd":23,"ayahCount":9,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":159,"rubEnd":159},{"page":399,"surahStart":29,"ayahStart":24,"surahEnd":29,"ayahEnd":30,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":159,"rubEnd":160},{"page":400,"surahStart":29,"ayahStart":31,"surahEnd":29,"ayahEnd":38,"ayahCount":8,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":160,"rubEnd":160},{"page":401,"surahStart":29,"ayahStart":39,"surahEnd":29,"ayahEnd":45,"ayahCount":7,"juzStart":20,"juzEnd":20,"hizbStart":40,"hizbEnd":40,"rubStart":160,"rubEnd":160},{"page":402,"surahStart":29,"ayahStart":46,"surahEnd":29,"ayahEnd":52,"ayahCount":7,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":161,"rubEnd":161},{"page":403,"surahStart":29,"ayahStart":53,"surahEnd":29,"ayahEnd":63,"ayahCount":11,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":161,"rubEnd":161},{"page":404,"surahStart":29,"ayahStart":64,"surahEnd":30,"ayahEnd":5,"ayahCount":11,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":161,"rubEnd":162},{"page":405,"surahStart":30,"ayahStart":6,"surahEnd":30,"ayahEnd":15,"ayahCount":10,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":162,"rubEnd":162},{"page":406,"surahStart":30,"ayahStart":16,"surahEnd":30,"ayahEnd":24,"ayahCount":9,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":162,"rubEnd":162},{"page":407,"surahStart":30,"ayahStart":25,"surahEnd":30,"ayahEnd":32,"ayahCount":8,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":162,"rubEnd":163},{"page":408,"surahStart":30,"ayahStart":33,"surahEnd":30,"ayahEnd":41,"ayahCount":9,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":163,"rubEnd":163},{"page":409,"surahStart":30,"ayahStart":42,"surahEnd":30,"ayahEnd":50,"ayahCount":9,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":163,"rubEnd":163},{"page":410,"surahStart":30,"ayahStart":51,"surahEnd":30,"ayahEnd":60,"ayahCount":10,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":163,"rubEnd":164},{"page":411,"surahStart":31,"ayahStart":1,"surahEnd":31,"ayahEnd":11,"ayahCount":11,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":164,"rubEnd":164},{"page":412,"surahStart":31,"ayahStart":12,"surahEnd":31,"ayahEnd":19,"ayahCount":8,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":41,"rubStart":164,"rubEnd":164},{"page":413,"surahStart":31,"ayahStart":20,"surahEnd":31,"ayahEnd":28,"ayahCount":9,"juzStart":21,"juzEnd":21,"hizbStart":41,"hizbEnd":42,"rubStart":164,"rubEnd":165},{"page":414,"surahStart":31,"ayahStart":29,"surahEnd":31,"ayahEnd":34,"ayahCount":6,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":165,"rubEnd":165},{"page":415,"surahStart":32,"ayahStart":1,"surahEnd":32,"ayahEnd":11,"ayahCount":11,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":165,"rubEnd":166},{"page":416,"surahStart":32,"ayahStart":12,"surahEnd":32,"ayahEnd":20,"ayahCount":9,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":166,"rubEnd":166},{"page":417,"surahStart":32,"ayahStart":21,"surahEnd":32,"ayahEnd":30,"ayahCount":10,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":166,"rubEnd":166},{"page":418,"surahStart":33,"ayahStart":1,"surahEnd":33,"ayahEnd":6,"ayahCount":6,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":167,"rubEnd":167},{"page":419,"surahStart":33,"ayahStart":7,"surahEnd":33,"ayahEnd":15,"ayahCount":9,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":167,"rubEnd":167},{"page":420,"surahStart":33,"ayahStart":16,"surahEnd":33,"ayahEnd":22,"ayahCount":7,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":167,"rubEnd":168},{"page":421,"surahStart":33,"ayahStart":23,"surahEnd":33,"ayahEnd":30,"ayahCount":8,"juzStart":21,"juzEnd":21,"hizbStart":42,"hizbEnd":42,"rubStart":168,"rubEnd":168},{"page":422,"surahStart":33,"ayahStart":31,"surahEnd":33,"ayahEnd":35,"ayahCount":5,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":169,"rubEnd":169},{"page":423,"surahStart":33,"ayahStart":36,"surahEnd":33,"ayahEnd":43,"ayahCount":8,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":169,"rubEnd":169},{"page":424,"surahStart":33,"ayahStart":44,"surahEnd":33,"ayahEnd":50,"ayahCount":7,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":169,"rubEnd":169},{"page":425,"surahStart":33,"ayahStart":51,"surahEnd":33,"ayahEnd":54,"ayahCount":4,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":170,"rubEnd":170},{"page":426,"surahStart":33,"ayahStart":55,"surahEnd":33,"ayahEnd":62,"ayahCount":8,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":170,"rubEnd":171},{"page":427,"surahStart":33,"ayahStart":63,"surahEnd":33,"ayahEnd":73,"ayahCount":11,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":171,"rubEnd":171},{"page":428,"surahStart":34,"ayahStart":1,"surahEnd":34,"ayahEnd":7,"ayahCount":7,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":171,"rubEnd":171},{"page":429,"surahStart":34,"ayahStart":8,"surahEnd":34,"ayahEnd":14,"ayahCount":7,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":171,"rubEnd":172},{"page":430,"surahStart":34,"ayahStart":15,"surahEnd":34,"ayahEnd":22,"ayahCount":8,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":43,"rubStart":172,"rubEnd":172},{"page":431,"surahStart":34,"ayahStart":23,"surahEnd":34,"ayahEnd":31,"ayahCount":9,"juzStart":22,"juzEnd":22,"hizbStart":43,"hizbEnd":44,"rubStart":172,"rubEnd":173},{"page":432,"surahStart":34,"ayahStart":32,"surahEnd":34,"ayahEnd":39,"ayahCount":8,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":173,"rubEnd":173},{"page":433,"surahStart":34,"ayahStart":40,"surahEnd":34,"ayahEnd":48,"ayahCount":9,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":173,"rubEnd":174},{"page":434,"surahStart":34,"ayahStart":49,"surahEnd":35,"ayahEnd":3,"ayahCount":9,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":174,"rubEnd":174},{"page":435,"surahStart":35,"ayahStart":4,"surahEnd":35,"ayahEnd":11,"ayahCount":8,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":174,"rubEnd":174},{"page":436,"surahStart":35,"ayahStart":12,"surahEnd":35,"ayahEnd":18,"ayahCount":7,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":174,"rubEnd":175},{"page":437,"surahStart":35,"ayahStart":19,"surahEnd":35,"ayahEnd":30,"ayahCount":12,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":175,"rubEnd":175},{"page":438,"surahStart":35,"ayahStart":31,"surahEnd":35,"ayahEnd":38,"ayahCount":8,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":175,"rubEnd":175},{"page":439,"surahStart":35,"ayahStart":39,"surahEnd":35,"ayahEnd":44,"ayahCount":6,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":175,"rubEnd":176},{"page":440,"surahStart":35,"ayahStart":45,"surahEnd":36,"ayahEnd":12,"ayahCount":13,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":176,"rubEnd":176},{"page":441,"surahStart":36,"ayahStart":13,"surahEnd":36,"ayahEnd":27,"ayahCount":15,"juzStart":22,"juzEnd":22,"hizbStart":44,"hizbEnd":44,"rubStart":176,"rubEnd":176},{"page":442,"surahStart":36,"ayahStart":28,"surahEnd":36,"ayahEnd":40,"ayahCount":13,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":177,"rubEnd":177},{"page":443,"surahStart":36,"ayahStart":41,"surahEnd":36,"ayahEnd":54,"ayahCount":14,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":177,"rubEnd":177},{"page":444,"surahStart":36,"ayahStart":55,"surahEnd":36,"ayahEnd":70,"ayahCount":16,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":177,"rubEnd":178},{"page":445,"surahStart":36,"ayahStart":71,"surahEnd":36,"ayahEnd":83,"ayahCount":13,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":178,"rubEnd":178},{"page":446,"surahStart":37,"ayahStart":1,"surahEnd":37,"ayahEnd":24,"ayahCount":24,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":178,"rubEnd":179},{"page":447,"surahStart":37,"ayahStart":25,"surahEnd":37,"ayahEnd":51,"ayahCount":27,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":179,"rubEnd":179},{"page":448,"surahStart":37,"ayahStart":52,"surahEnd":37,"ayahEnd":76,"ayahCount":25,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":179,"rubEnd":179},{"page":449,"surahStart":37,"ayahStart":77,"surahEnd":37,"ayahEnd":102,"ayahCount":26,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":179,"rubEnd":180},{"page":450,"surahStart":37,"ayahStart":103,"surahEnd":37,"ayahEnd":126,"ayahCount":24,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":45,"rubStart":180,"rubEnd":180},{"page":451,"surahStart":37,"ayahStart":127,"surahEnd":37,"ayahEnd":153,"ayahCount":27,"juzStart":23,"juzEnd":23,"hizbStart":45,"hizbEnd":46,"rubStart":180,"rubEnd":181},{"page":452,"surahStart":37,"ayahStart":154,"surahEnd":37,"ayahEnd":182,"ayahCount":29,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":181,"rubEnd":181},{"page":453,"surahStart":38,"ayahStart":1,"surahEnd":38,"ayahEnd":16,"ayahCount":16,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":181,"rubEnd":181},{"page":454,"surahStart":38,"ayahStart":17,"surahEnd":38,"ayahEnd":26,"ayahCount":10,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":181,"rubEnd":182},{"page":455,"surahStart":38,"ayahStart":27,"surahEnd":38,"ayahEnd":42,"ayahCount":16,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":182,"rubEnd":182},{"page":456,"surahStart":38,"ayahStart":43,"surahEnd":38,"ayahEnd":61,"ayahCount":19,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":182,"rubEnd":183},{"page":457,"surahStart":38,"ayahStart":62,"surahEnd":38,"ayahEnd":83,"ayahCount":22,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":183,"rubEnd":183},{"page":458,"surahStart":38,"ayahStart":84,"surahEnd":39,"ayahEnd":5,"ayahCount":10,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":183,"rubEnd":183},{"page":459,"surahStart":39,"ayahStart":6,"surahEnd":39,"ayahEnd":10,"ayahCount":5,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":183,"rubEnd":184},{"page":460,"surahStart":39,"ayahStart":11,"surahEnd":39,"ayahEnd":21,"ayahCount":11,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":184,"rubEnd":184},{"page":461,"surahStart":39,"ayahStart":22,"surahEnd":39,"ayahEnd":31,"ayahCount":10,"juzStart":23,"juzEnd":23,"hizbStart":46,"hizbEnd":46,"rubStart":184,"rubEnd":184},{"page":462,"surahStart":39,"ayahStart":32,"surahEnd":39,"ayahEnd":40,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":185,"rubEnd":185},{"page":463,"surahStart":39,"ayahStart":41,"surahEnd":39,"ayahEnd":47,"ayahCount":7,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":185,"rubEnd":185},{"page":464,"surahStart":39,"ayahStart":48,"surahEnd":39,"ayahEnd":56,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":185,"rubEnd":186},{"page":465,"surahStart":39,"ayahStart":57,"surahEnd":39,"ayahEnd":67,"ayahCount":11,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":186,"rubEnd":186},{"page":466,"surahStart":39,"ayahStart":68,"surahEnd":39,"ayahEnd":74,"ayahCount":7,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":186,"rubEnd":186},{"page":467,"surahStart":39,"ayahStart":75,"surahEnd":40,"ayahEnd":7,"ayahCount":8,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":186,"rubEnd":187},{"page":468,"surahStart":40,"ayahStart":8,"surahEnd":40,"ayahEnd":16,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":187,"rubEnd":187},{"page":469,"surahStart":40,"ayahStart":17,"surahEnd":40,"ayahEnd":25,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":187,"rubEnd":188},{"page":470,"surahStart":40,"ayahStart":26,"surahEnd":40,"ayahEnd":33,"ayahCount":8,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":188,"rubEnd":188},{"page":471,"surahStart":40,"ayahStart":34,"surahEnd":40,"ayahEnd":40,"ayahCount":7,"juzStart":24,"juzEnd":24,"hizbStart":47,"hizbEnd":47,"rubStart":188,"rubEnd":188},{"page":472,"surahStart":40,"ayahStart":41,"surahEnd":40,"ayahEnd":49,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":189,"rubEnd":189},{"page":473,"surahStart":40,"ayahStart":50,"surahEnd":40,"ayahEnd":58,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":189,"rubEnd":189},{"page":474,"surahStart":40,"ayahStart":59,"surahEnd":40,"ayahEnd":66,"ayahCount":8,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":189,"rubEnd":190},{"page":475,"surahStart":40,"ayahStart":67,"surahEnd":40,"ayahEnd":77,"ayahCount":11,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":190,"rubEnd":190},{"page":476,"surahStart":40,"ayahStart":78,"surahEnd":40,"ayahEnd":85,"ayahCount":8,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":190,"rubEnd":190},{"page":477,"surahStart":41,"ayahStart":1,"surahEnd":41,"ayahEnd":11,"ayahCount":11,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":190,"rubEnd":191},{"page":478,"surahStart":41,"ayahStart":12,"surahEnd":41,"ayahEnd":20,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":191,"rubEnd":191},{"page":479,"surahStart":41,"ayahStart":21,"surahEnd":41,"ayahEnd":29,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":191,"rubEnd":192},{"page":480,"surahStart":41,"ayahStart":30,"surahEnd":41,"ayahEnd":38,"ayahCount":9,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":192,"rubEnd":192},{"page":481,"surahStart":41,"ayahStart":39,"surahEnd":41,"ayahEnd":46,"ayahCount":8,"juzStart":24,"juzEnd":24,"hizbStart":48,"hizbEnd":48,"rubStart":192,"rubEnd":192},{"page":482,"surahStart":41,"ayahStart":47,"surahEnd":41,"ayahEnd":54,"ayahCount":8,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":193,"rubEnd":193},{"page":483,"surahStart":42,"ayahStart":1,"surahEnd":42,"ayahEnd":10,"ayahCount":10,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":193,"rubEnd":193},{"page":484,"surahStart":42,"ayahStart":11,"surahEnd":42,"ayahEnd":15,"ayahCount":5,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":193,"rubEnd":194},{"page":485,"surahStart":42,"ayahStart":16,"surahEnd":42,"ayahEnd":22,"ayahCount":7,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":194,"rubEnd":194},{"page":486,"surahStart":42,"ayahStart":23,"surahEnd":42,"ayahEnd":31,"ayahCount":9,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":194,"rubEnd":195},{"page":487,"surahStart":42,"ayahStart":32,"surahEnd":42,"ayahEnd":44,"ayahCount":13,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":195,"rubEnd":195},{"page":488,"surahStart":42,"ayahStart":45,"surahEnd":42,"ayahEnd":51,"ayahCount":7,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":195,"rubEnd":196},{"page":489,"surahStart":42,"ayahStart":52,"surahEnd":43,"ayahEnd":10,"ayahCount":12,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":196,"rubEnd":196},{"page":490,"surahStart":43,"ayahStart":11,"surahEnd":43,"ayahEnd":22,"ayahCount":12,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":49,"rubStart":196,"rubEnd":196},{"page":491,"surahStart":43,"ayahStart":23,"surahEnd":43,"ayahEnd":33,"ayahCount":11,"juzStart":25,"juzEnd":25,"hizbStart":49,"hizbEnd":50,"rubStart":196,"rubEnd":197},{"page":492,"surahStart":43,"ayahStart":34,"surahEnd":43,"ayahEnd":47,"ayahCount":14,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":197,"rubEnd":197},{"page":493,"surahStart":43,"ayahStart":48,"surahEnd":43,"ayahEnd":60,"ayahCount":13,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":197,"rubEnd":198},{"page":494,"surahStart":43,"ayahStart":61,"surahEnd":43,"ayahEnd":73,"ayahCount":13,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":198,"rubEnd":198},{"page":495,"surahStart":43,"ayahStart":74,"surahEnd":43,"ayahEnd":89,"ayahCount":16,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":198,"rubEnd":198},{"page":496,"surahStart":44,"ayahStart":1,"surahEnd":44,"ayahEnd":18,"ayahCount":18,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":198,"rubEnd":199},{"page":497,"surahStart":44,"ayahStart":19,"surahEnd":44,"ayahEnd":39,"ayahCount":21,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":199,"rubEnd":199},{"page":498,"surahStart":44,"ayahStart":40,"surahEnd":44,"ayahEnd":59,"ayahCount":20,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":199,"rubEnd":199},{"page":499,"surahStart":45,"ayahStart":1,"surahEnd":45,"ayahEnd":13,"ayahCount":13,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":199,"rubEnd":200},{"page":500,"surahStart":45,"ayahStart":14,"surahEnd":45,"ayahEnd":22,"ayahCount":9,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":200,"rubEnd":200},{"page":501,"surahStart":45,"ayahStart":23,"surahEnd":45,"ayahEnd":32,"ayahCount":10,"juzStart":25,"juzEnd":25,"hizbStart":50,"hizbEnd":50,"rubStart":200,"rubEnd":200},{"page":502,"surahStart":45,"ayahStart":33,"surahEnd":46,"ayahEnd":5,"ayahCount":10,"juzStart":25,"juzEnd":26,"hizbStart":50,"hizbEnd":51,"rubStart":200,"rubEnd":201},{"page":503,"surahStart":46,"ayahStart":6,"surahEnd":46,"ayahEnd":14,"ayahCount":9,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":201,"rubEnd":201},{"page":504,"surahStart":46,"ayahStart":15,"surahEnd":46,"ayahEnd":20,"ayahCount":6,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":201,"rubEnd":201},{"page":505,"surahStart":46,"ayahStart":21,"surahEnd":46,"ayahEnd":28,"ayahCount":8,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":202,"rubEnd":202},{"page":506,"surahStart":46,"ayahStart":29,"surahEnd":46,"ayahEnd":35,"ayahCount":7,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":202,"rubEnd":202},{"page":507,"surahStart":47,"ayahStart":1,"surahEnd":47,"ayahEnd":11,"ayahCount":11,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":202,"rubEnd":203},{"page":508,"surahStart":47,"ayahStart":12,"surahEnd":47,"ayahEnd":19,"ayahCount":8,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":203,"rubEnd":203},{"page":509,"surahStart":47,"ayahStart":20,"surahEnd":47,"ayahEnd":29,"ayahCount":10,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":203,"rubEnd":203},{"page":510,"surahStart":47,"ayahStart":30,"surahEnd":47,"ayahEnd":38,"ayahCount":9,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":203,"rubEnd":204},{"page":511,"surahStart":48,"ayahStart":1,"surahEnd":48,"ayahEnd":9,"ayahCount":9,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":204,"rubEnd":204},{"page":512,"surahStart":48,"ayahStart":10,"surahEnd":48,"ayahEnd":15,"ayahCount":6,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":51,"rubStart":204,"rubEnd":204},{"page":513,"surahStart":48,"ayahStart":16,"surahEnd":48,"ayahEnd":23,"ayahCount":8,"juzStart":26,"juzEnd":26,"hizbStart":51,"hizbEnd":52,"rubStart":204,"rubEnd":205},{"page":514,"surahStart":48,"ayahStart":24,"surahEnd":48,"ayahEnd":28,"ayahCount":5,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":205,"rubEnd":205},{"page":515,"surahStart":48,"ayahStart":29,"surahEnd":49,"ayahEnd":4,"ayahCount":5,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":205,"rubEnd":206},{"page":516,"surahStart":49,"ayahStart":5,"surahEnd":49,"ayahEnd":11,"ayahCount":7,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":206,"rubEnd":206},{"page":517,"surahStart":49,"ayahStart":12,"surahEnd":49,"ayahEnd":18,"ayahCount":7,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":206,"rubEnd":207},{"page":518,"surahStart":50,"ayahStart":1,"surahEnd":50,"ayahEnd":15,"ayahCount":15,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":207,"rubEnd":207},{"page":519,"surahStart":50,"ayahStart":16,"surahEnd":50,"ayahEnd":35,"ayahCount":20,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":207,"rubEnd":208},{"page":520,"surahStart":50,"ayahStart":36,"surahEnd":51,"ayahEnd":6,"ayahCount":16,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":208,"rubEnd":208},{"page":521,"surahStart":51,"ayahStart":7,"surahEnd":51,"ayahEnd":30,"ayahCount":24,"juzStart":26,"juzEnd":26,"hizbStart":52,"hizbEnd":52,"rubStart":208,"rubEnd":208},{"page":522,"surahStart":51,"ayahStart":31,"surahEnd":51,"ayahEnd":51,"ayahCount":21,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":209,"rubEnd":209},{"page":523,"surahStart":51,"ayahStart":52,"surahEnd":52,"ayahEnd":14,"ayahCount":23,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":209,"rubEnd":209},{"page":524,"surahStart":52,"ayahStart":15,"surahEnd":52,"ayahEnd":31,"ayahCount":17,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":209,"rubEnd":210},{"page":525,"surahStart":52,"ayahStart":32,"surahEnd":52,"ayahEnd":49,"ayahCount":18,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":210,"rubEnd":210},{"page":526,"surahStart":53,"ayahStart":1,"surahEnd":53,"ayahEnd":26,"ayahCount":26,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":210,"rubEnd":211},{"page":527,"surahStart":53,"ayahStart":27,"surahEnd":53,"ayahEnd":44,"ayahCount":18,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":211,"rubEnd":211},{"page":528,"surahStart":53,"ayahStart":45,"surahEnd":54,"ayahEnd":6,"ayahCount":24,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":211,"rubEnd":211},{"page":529,"surahStart":54,"ayahStart":7,"surahEnd":54,"ayahEnd":27,"ayahCount":21,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":211,"rubEnd":212},{"page":530,"surahStart":54,"ayahStart":28,"surahEnd":54,"ayahEnd":49,"ayahCount":22,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":53,"rubStart":212,"rubEnd":212},{"page":531,"surahStart":54,"ayahStart":50,"surahEnd":55,"ayahEnd":16,"ayahCount":22,"juzStart":27,"juzEnd":27,"hizbStart":53,"hizbEnd":54,"rubStart":212,"rubEnd":213},{"page":532,"surahStart":55,"ayahStart":17,"surahEnd":55,"ayahEnd":40,"ayahCount":24,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":213,"rubEnd":213},{"page":533,"surahStart":55,"ayahStart":41,"surahEnd":55,"ayahEnd":67,"ayahCount":27,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":213,"rubEnd":213},{"page":534,"surahStart":55,"ayahStart":68,"surahEnd":56,"ayahEnd":16,"ayahCount":27,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":213,"rubEnd":214},{"page":535,"surahStart":56,"ayahStart":17,"surahEnd":56,"ayahEnd":50,"ayahCount":34,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":214,"rubEnd":214},{"page":536,"surahStart":56,"ayahStart":51,"surahEnd":56,"ayahEnd":76,"ayahCount":26,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":214,"rubEnd":215},{"page":537,"surahStart":56,"ayahStart":77,"surahEnd":57,"ayahEnd":3,"ayahCount":23,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":215,"rubEnd":215},{"page":538,"surahStart":57,"ayahStart":4,"surahEnd":57,"ayahEnd":11,"ayahCount":8,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":215,"rubEnd":215},{"page":539,"surahStart":57,"ayahStart":12,"surahEnd":57,"ayahEnd":18,"ayahCount":7,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":215,"rubEnd":216},{"page":540,"surahStart":57,"ayahStart":19,"surahEnd":57,"ayahEnd":24,"ayahCount":6,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":216,"rubEnd":216},{"page":541,"surahStart":57,"ayahStart":25,"surahEnd":57,"ayahEnd":29,"ayahCount":5,"juzStart":27,"juzEnd":27,"hizbStart":54,"hizbEnd":54,"rubStart":216,"rubEnd":216},{"page":542,"surahStart":58,"ayahStart":1,"surahEnd":58,"ayahEnd":6,"ayahCount":6,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":217,"rubEnd":217},{"page":543,"surahStart":58,"ayahStart":7,"surahEnd":58,"ayahEnd":11,"ayahCount":5,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":217,"rubEnd":217},{"page":544,"surahStart":58,"ayahStart":12,"surahEnd":58,"ayahEnd":21,"ayahCount":10,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":217,"rubEnd":218},{"page":545,"surahStart":58,"ayahStart":22,"surahEnd":59,"ayahEnd":3,"ayahCount":4,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":218,"rubEnd":218},{"page":546,"surahStart":59,"ayahStart":4,"surahEnd":59,"ayahEnd":9,"ayahCount":6,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":218,"rubEnd":218},{"page":547,"surahStart":59,"ayahStart":10,"surahEnd":59,"ayahEnd":16,"ayahCount":7,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":218,"rubEnd":219},{"page":548,"surahStart":59,"ayahStart":17,"surahEnd":59,"ayahEnd":24,"ayahCount":8,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":219,"rubEnd":219},{"page":549,"surahStart":60,"ayahStart":1,"surahEnd":60,"ayahEnd":5,"ayahCount":5,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":219,"rubEnd":219},{"page":550,"surahStart":60,"ayahStart":6,"surahEnd":60,"ayahEnd":11,"ayahCount":6,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":219,"rubEnd":220},{"page":551,"surahStart":60,"ayahStart":12,"surahEnd":61,"ayahEnd":5,"ayahCount":7,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":220,"rubEnd":220},{"page":552,"surahStart":61,"ayahStart":6,"surahEnd":61,"ayahEnd":14,"ayahCount":9,"juzStart":28,"juzEnd":28,"hizbStart":55,"hizbEnd":55,"rubStart":220,"rubEnd":220},{"page":553,"surahStart":62,"ayahStart":1,"surahEnd":62,"ayahEnd":8,"ayahCount":8,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":221,"rubEnd":221},{"page":554,"surahStart":62,"ayahStart":9,"surahEnd":63,"ayahEnd":4,"ayahCount":7,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":221,"rubEnd":222},{"page":555,"surahStart":63,"ayahStart":5,"surahEnd":63,"ayahEnd":11,"ayahCount":7,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":222,"rubEnd":222},{"page":556,"surahStart":64,"ayahStart":1,"surahEnd":64,"ayahEnd":9,"ayahCount":9,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":222,"rubEnd":222},{"page":557,"surahStart":64,"ayahStart":10,"surahEnd":64,"ayahEnd":18,"ayahCount":9,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":222,"rubEnd":222},{"page":558,"surahStart":65,"ayahStart":1,"surahEnd":65,"ayahEnd":5,"ayahCount":5,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":223,"rubEnd":223},{"page":559,"surahStart":65,"ayahStart":6,"surahEnd":65,"ayahEnd":12,"ayahCount":7,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":223,"rubEnd":223},{"page":560,"surahStart":66,"ayahStart":1,"surahEnd":66,"ayahEnd":7,"ayahCount":7,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":224,"rubEnd":224},{"page":561,"surahStart":66,"ayahStart":8,"surahEnd":66,"ayahEnd":12,"ayahCount":5,"juzStart":28,"juzEnd":28,"hizbStart":56,"hizbEnd":56,"rubStart":224,"rubEnd":224},{"page":562,"surahStart":67,"ayahStart":1,"surahEnd":67,"ayahEnd":12,"ayahCount":12,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":225,"rubEnd":225},{"page":563,"surahStart":67,"ayahStart":13,"surahEnd":67,"ayahEnd":26,"ayahCount":14,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":225,"rubEnd":225},{"page":564,"surahStart":67,"ayahStart":27,"surahEnd":68,"ayahEnd":15,"ayahCount":19,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":225,"rubEnd":226},{"page":565,"surahStart":68,"ayahStart":16,"surahEnd":68,"ayahEnd":42,"ayahCount":27,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":226,"rubEnd":226},{"page":566,"surahStart":68,"ayahStart":43,"surahEnd":69,"ayahEnd":8,"ayahCount":18,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":226,"rubEnd":227},{"page":567,"surahStart":69,"ayahStart":9,"surahEnd":69,"ayahEnd":34,"ayahCount":26,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":227,"rubEnd":227},{"page":568,"surahStart":69,"ayahStart":35,"surahEnd":70,"ayahEnd":10,"ayahCount":28,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":227,"rubEnd":227},{"page":569,"surahStart":70,"ayahStart":11,"surahEnd":70,"ayahEnd":39,"ayahCount":29,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":227,"rubEnd":228},{"page":570,"surahStart":70,"ayahStart":40,"surahEnd":71,"ayahEnd":10,"ayahCount":15,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":228,"rubEnd":228},{"page":571,"surahStart":71,"ayahStart":11,"surahEnd":71,"ayahEnd":28,"ayahCount":18,"juzStart":29,"juzEnd":29,"hizbStart":57,"hizbEnd":57,"rubStart":228,"rubEnd":228},{"page":572,"surahStart":72,"ayahStart":1,"surahEnd":72,"ayahEnd":13,"ayahCount":13,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":229,"rubEnd":229},{"page":573,"surahStart":72,"ayahStart":14,"surahEnd":72,"ayahEnd":28,"ayahCount":15,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":229,"rubEnd":229},{"page":574,"surahStart":73,"ayahStart":1,"surahEnd":73,"ayahEnd":19,"ayahCount":19,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":229,"rubEnd":229},{"page":575,"surahStart":73,"ayahStart":20,"surahEnd":74,"ayahEnd":17,"ayahCount":18,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":230,"rubEnd":230},{"page":576,"surahStart":74,"ayahStart":18,"surahEnd":74,"ayahEnd":47,"ayahCount":30,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":230,"rubEnd":230},{"page":577,"surahStart":74,"ayahStart":48,"surahEnd":75,"ayahEnd":19,"ayahCount":28,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":230,"rubEnd":231},{"page":578,"surahStart":75,"ayahStart":20,"surahEnd":76,"ayahEnd":5,"ayahCount":26,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":231,"rubEnd":231},{"page":579,"surahStart":76,"ayahStart":6,"surahEnd":76,"ayahEnd":25,"ayahCount":20,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":231,"rubEnd":232},{"page":580,"surahStart":76,"ayahStart":26,"surahEnd":77,"ayahEnd":19,"ayahCount":25,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":232,"rubEnd":232},{"page":581,"surahStart":77,"ayahStart":20,"surahEnd":77,"ayahEnd":50,"ayahCount":31,"juzStart":29,"juzEnd":29,"hizbStart":58,"hizbEnd":58,"rubStart":232,"rubEnd":232},{"page":582,"surahStart":78,"ayahStart":1,"surahEnd":78,"ayahEnd":30,"ayahCount":30,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":233,"rubEnd":233},{"page":583,"surahStart":78,"ayahStart":31,"surahEnd":79,"ayahEnd":15,"ayahCount":25,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":233,"rubEnd":233},{"page":584,"surahStart":79,"ayahStart":16,"surahEnd":79,"ayahEnd":46,"ayahCount":31,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":233,"rubEnd":233},{"page":585,"surahStart":80,"ayahStart":1,"surahEnd":80,"ayahEnd":42,"ayahCount":42,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":234,"rubEnd":234},{"page":586,"surahStart":81,"ayahStart":1,"surahEnd":81,"ayahEnd":29,"ayahCount":29,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":234,"rubEnd":234},{"page":587,"surahStart":82,"ayahStart":1,"surahEnd":83,"ayahEnd":6,"ayahCount":25,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":235,"rubEnd":235},{"page":588,"surahStart":83,"ayahStart":7,"surahEnd":83,"ayahEnd":34,"ayahCount":28,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":235,"rubEnd":235},{"page":589,"surahStart":83,"ayahStart":35,"surahEnd":84,"ayahEnd":25,"ayahCount":27,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":235,"rubEnd":236},{"page":590,"surahStart":85,"ayahStart":1,"surahEnd":85,"ayahEnd":22,"ayahCount":22,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":59,"rubStart":236,"rubEnd":236},{"page":591,"surahStart":86,"ayahStart":1,"surahEnd":87,"ayahEnd":15,"ayahCount":32,"juzStart":30,"juzEnd":30,"hizbStart":59,"hizbEnd":60,"rubStart":236,"rubEnd":237},{"page":592,"surahStart":87,"ayahStart":16,"surahEnd":88,"ayahEnd":26,"ayahCount":30,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":237,"rubEnd":237},{"page":593,"surahStart":89,"ayahStart":1,"surahEnd":89,"ayahEnd":23,"ayahCount":23,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":237,"rubEnd":237},{"page":594,"surahStart":89,"ayahStart":24,"surahEnd":90,"ayahEnd":20,"ayahCount":27,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":237,"rubEnd":238},{"page":595,"surahStart":91,"ayahStart":1,"surahEnd":92,"ayahEnd":14,"ayahCount":29,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":238,"rubEnd":238},{"page":596,"surahStart":92,"ayahStart":15,"surahEnd":94,"ayahEnd":8,"ayahCount":26,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":238,"rubEnd":239},{"page":597,"surahStart":95,"ayahStart":1,"surahEnd":96,"ayahEnd":19,"ayahCount":27,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":239,"rubEnd":239},{"page":598,"surahStart":97,"ayahStart":1,"surahEnd":98,"ayahEnd":7,"ayahCount":12,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":239,"rubEnd":239},{"page":599,"surahStart":98,"ayahStart":8,"surahEnd":100,"ayahEnd":9,"ayahCount":18,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":239,"rubEnd":240},{"page":600,"surahStart":100,"ayahStart":10,"surahEnd":102,"ayahEnd":8,"ayahCount":21,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":240,"rubEnd":240},{"page":601,"surahStart":103,"ayahStart":1,"surahEnd":105,"ayahEnd":5,"ayahCount":17,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":240,"rubEnd":240},{"page":602,"surahStart":106,"ayahStart":1,"surahEnd":108,"ayahEnd":3,"ayahCount":14,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":240,"rubEnd":240},{"page":603,"surahStart":109,"ayahStart":1,"surahEnd":111,"ayahEnd":5,"ayahCount":14,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":240,"rubEnd":240},{"page":604,"surahStart":112,"ayahStart":1,"surahEnd":114,"ayahEnd":6,"ayahCount":15,"juzStart":30,"juzEnd":30,"hizbStart":60,"hizbEnd":60,"rubStart":240,"rubEnd":240}];

const SURAH_NAMES = [null,
"الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
"هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
"الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
"لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
"فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
"الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
"الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
"نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
"التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
"الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
"القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
"المسد","الإخلاص","الفلق","الناس"
];

function pageInfo(n) {
  return PA[n] || null;
}

function surahRangeLabel(fromPage, toPage) {
  const a = pageInfo(fromPage);
  const b = pageInfo(toPage);
  if (!a || !b) return "";
  const s1 = SURAH_NAMES[a.surahStart];
  const s2 = SURAH_NAMES[b.surahEnd];
  if (fromPage === toPage) {
    if (a.surahStart === a.surahEnd) {
      return `سورة ${s1} — الآيات ${a.ayahStart} إلى ${a.ayahEnd}`;
    }
    return `من سورة ${s1} إلى سورة ${SURAH_NAMES[a.surahEnd]}`;
  }
  if (s1 === s2) return `سورة ${s1}`;
  return `من سورة ${s1} إلى سورة ${s2}`;
}

function juzLabel(fromPage, toPage) {
  const a = pageInfo(fromPage);
  const b = pageInfo(toPage);
  if (!a || !b) return "";
  if (a.juzStart === b.juzEnd) return `الجزء ${a.juzStart}`;
  return `الأجزاء ${a.juzStart}-${b.juzEnd}`;
}


const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
// Format a Date using its LOCAL calendar day (never toISOString, which converts to
// UTC and silently shifts the date — and therefore the weekday — for anyone not in
// the UTC timezone, e.g. Saudi Arabia at UTC+3).
const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const todayStr = () => toDateStr(new Date());
const fmtDate = (s) =>
  new Date(s + "T00:00:00").toLocaleDateString("ar-SA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

/* ---------------------------------------------------------------
   Eight-pointed star (khatim) — signature motif
----------------------------------------------------------------*/
function Rub({ size = 18, color = C.gold, opacity = 1, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ opacity }}
    >
      <g fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round">
        <polygon points="50,4 62,30 90,20 70,42 96,50 70,58 90,80 62,70 50,96 38,70 10,80 30,58 4,50 30,42 10,20 38,30" />
      </g>
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 py-1" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${C.goldDim}, transparent)` }} />
      <Rub size={10} color={C.gold} opacity={0.7} />
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${C.goldDim}, transparent)` }} />
    </div>
  );
}

// Label + -/+ stepper + number input, so adjusting a plan (especially half-page "وجه"
// amounts) is a tap away instead of typing decimals on a small keyboard.
function NumberStepper({ label, value, onChange, min = 0, max = Infinity, step = 1, hint }) {
  const round = (v) => Math.round(v / step) * step;
  const dec = () => onChange(Math.max(min, round(value - step)));
  const inc = () => onChange(Math.min(max, round(value + step)));
  return (
    <div>
      <label className="block text-sm mb-1" style={{ color: C.muted }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: C.ink, border: `1px solid ${C.panelLighter}`, color: C.parchment }}
          aria-label={`إنقاص ${label}`}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 min-w-0 text-center rounded-lg px-2 py-2.5 text-sm outline-none"
          style={{ background: C.ink, color: C.parchment, border: `1px solid ${C.panelLighter}` }}
        />
        <button
          type="button"
          onClick={inc}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: C.ink, border: `1px solid ${C.panelLighter}`, color: C.parchment }}
          aria-label={`زيادة ${label}`}
        >
          +
        </button>
      </div>
      {hint && (
        <div className="text-[11px] mt-1" style={{ color: C.muted }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Schedule generation
----------------------------------------------------------------*/
// Distribute `total` half-page units across `n` study-days. If total >= n, every day
// gets a fair share (base, +1 for the remainder days). If total < n (a small plan over
// a long duration), front-load it — finish at the start of the duration, one unit per
// day, and leave the remaining days with no target (shown as "لا يوجد وِرد").
function distributeUnits(total, n) {
  const amounts = new Array(n).fill(0);
  if (total <= 0 || n <= 0) return amounts;
  if (total >= n) {
    const base = Math.floor(total / n);
    const rem = total % n;
    for (let i = 0; i < n; i++) amounts[i] = base + (i < rem ? 1 : 0);
  } else {
    for (let k = 0; k < total; k++) {
      amounts[k] = 1;
    }
  }
  return amounts;
}

function generateSchedule({ totalUnits, durationDays, startDate, offDays, startPage }) {
  const days = buildDates(startDate, durationDays, offDays);
  const n = days.length || 1;
  const startHp = ((startPage || 1) - 1) * 2 + 1;
  const totalHalf = Math.max(0, Math.round(totalUnits * 2));
  const amounts = distributeUnits(totalHalf, n);
  let cursor = startHp;
  let coveredEnd = startHp - 1;
  const result = [];
  days.forEach((date, i) => {
    const halfAmount = amounts[i];
    if (halfAmount <= 0) return; // filled in the review pass below
    const from = cursor;
    const to = Math.min(cursor + halfAmount - 1, 1208);
    cursor += halfAmount;
    coveredEnd = to;
    result.push({
      id: uid(),
      date,
      from, // half-page index (1..1208): each Mushaf page = 2 "أوجه"
      to,
      amount: halfAmount / 2, // in pages, e.g. 0.5
      status: "pending", // pending | done | missed
      note: "",
    });
  });

  // Content finished before the plan duration ran out — keep the remaining days busy
  // with a cycling مراجعة of everything covered so far, rather than leaving them empty.
  if (coveredEnd >= startHp) {
    const totalCoveredHalf = coveredEnd - startHp + 1;
    const REVIEW_CHUNK = Math.max(1, Math.min(totalCoveredHalf, 2));
    let reviewCursor = 0;
    days.forEach((date, i) => {
      if (amounts[i] > 0) return;
      let from = startHp + (reviewCursor % totalCoveredHalf);
      let amount = Math.min(REVIEW_CHUNK, totalCoveredHalf);
      let to = from + amount - 1;
      if (to > coveredEnd) {
        to = coveredEnd;
        amount = to - from + 1;
      }
      result.push({
        id: uid(),
        date,
        from,
        to,
        amount: amount / 2,
        status: "pending",
        note: "",
        isReview: true,
      });
      reviewCursor = to - startHp + 1 >= totalCoveredHalf ? 0 : to - startHp + 1;
    });
    result.sort((a, b) => (a.date < b.date ? -1 : 1));
  }

  return result;
}

// Number of ayat in each surah (index 1-114), used to render clean "1 - N" ranges
// and to snap reverse-mode boundaries to the start of a surah.
const SURAH_AYAH = [
  null,
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6,
];

// Advance k ayat forward from (surah, ayah), rolling over into the next surah(s) as needed.
function advanceAyah(surah, ayah, k) {
  let s = surah;
  let a = ayah;
  while (k > 0 && s <= 114) {
    const remaining = SURAH_AYAH[s] - a + 1;
    if (k < remaining) {
      a += k;
      k = 0;
    } else {
      k -= remaining;
      s += 1;
      a = 1;
    }
  }
  return { surah: Math.min(s, 114), ayah: a };
}

// Step back exactly one ayah from (surah, ayah).
function retreatAyah(surah, ayah) {
  if (ayah > 1) return { surah, ayah: ayah - 1 };
  const s = Math.max(surah - 1, 1);
  return { surah: s, ayah: surah > 1 ? SURAH_AYAH[s] : 1 };
}

// Mushaf page -> half-page ("وجه") helpers. hp 1 = first half of page 1, hp 2 = second
// half of page 1, hp 3 = first half of page 2, etc. 1208 half-pages total.
const pageOfHp = (hp) => Math.max(1, Math.min(604, Math.ceil(hp / 2)));

// Precise (surah, ayah) at the start of a given half-page, computed by walking exactly
// half of that page's ayat forward from its first ayah — exact, not approximate.
function halfPageStart(hp) {
  const page = pageOfHp(hp);
  const info = PA[page];
  const isSecondHalf = hp % 2 === 0;
  if (!isSecondHalf) return { surah: info.surahStart, ayah: info.ayahStart };
  const firstHalfCount = Math.ceil(info.ayahCount / 2);
  return advanceAyah(info.surahStart, info.ayahStart, firstHalfCount);
}

// Human label for a half-page range (fromHp..toHp inclusive), e.g. "سورة البقرة — الآيات 1 إلى 3".
function halfPageRangeLabel(fromHp, toHp) {
  if (!fromHp || !toHp) return "";
  const start = halfPageStart(fromHp);
  const nextStart = halfPageStart(Math.min(toHp + 1, 1208));
  const end = toHp >= 1208 ? { surah: 114, ayah: SURAH_AYAH[114] } : retreatAyah(nextStart.surah, nextStart.ayah);
  if (start.surah === end.surah) {
    return `سورة ${SURAH_NAMES[start.surah]} — الآيات ${start.ayah} إلى ${end.ayah}`;
  }
  return `من سورة ${SURAH_NAMES[start.surah]} (آية ${start.ayah}) إلى سورة ${SURAH_NAMES[end.surah]} (آية ${end.ayah})`;
}

// Short "page + half" descriptor for a single half-page, e.g. "النصف الثاني من صفحة 5".
function halfPageShortLabel(hp) {
  const page = pageOfHp(hp);
  return hp % 2 === 1 ? `النصف الأول من صفحة ${page}` : `النصف الثاني من صفحة ${page}`;
}

// Main range label for a day's target, e.g. "من نص صفحة 5 (٢) إلى صفحة 6" or "صفحة 5 كاملة".
function halfPageMainLabel(fromHp, toHp) {
  if (fromHp === toHp) return halfPageShortLabel(fromHp);
  const fp = pageOfHp(fromHp);
  const tp = pageOfHp(toHp);
  const fromWhole = fromHp % 2 === 1;
  const toWhole = toHp % 2 === 0;
  if (fromWhole && toWhole) {
    return fp === tp ? `صفحة ${fp}` : `من صفحة ${fp} إلى ${tp}`;
  }
  const startStr = fromWhole ? `صفحة ${fp}` : `نص صفحة ${fp} الثاني`;
  const endStr = toWhole ? `صفحة ${tp}` : `نص صفحة ${tp} الأول`;
  return `من ${startStr} إلى ${endStr}`;
}

function reverseRangeLabel(fromSurah, toSurah, fromAyah, toAyah) {
  if (!fromSurah || !toSurah) return "";
  const fa = fromAyah || 1;
  const ta = toAyah || SURAH_AYAH[toSurah];
  if (fromSurah === toSurah) {
    return `سورة ${SURAH_NAMES[fromSurah]} — الآيات ${fa} إلى ${ta}`;
  }
  return `من سورة ${SURAH_NAMES[fromSurah]} (آية ${fa}) إلى سورة ${SURAH_NAMES[toSurah]} (آية ${ta})`;
}

// Short label for a review sub-track (مراجعة صغرى / كبرى), direction-aware.
function trackLabel(direction, range) {
  if (!range) return "";
  if (direction === "reverse") {
    return range.from === range.to
      ? `سورة ${SURAH_NAMES[range.from]}`
      : `من سورة ${SURAH_NAMES[range.from]} إلى سورة ${SURAH_NAMES[range.to]}`;
  }
  return halfPageMainLabel(range.from, range.to);
}

// Given a slice of schedule days (each with .amount pages and .from/.to) and a
// cumulative-page window [startOffset, startOffset+span), find which day(s) that
// window falls across and return the combined {from, to}. Works for both forward
// (page/half-page domain) and reverse (surah domain) schedules — it just reads
// whatever from/to values those days already carry.
function pageOffsetRange(days, startOffset, span) {
  let acc = 0;
  let fromDay = null;
  let toDay = null;
  for (const d of days) {
    const dayStart = acc;
    const dayEnd = acc + (d.amount || 0);
    if (dayEnd > startOffset && dayStart < startOffset + span) {
      if (!fromDay) fromDay = d;
      toDay = d;
    }
    acc = dayEnd;
    if (acc >= startOffset + span) break;
  }
  if (!fromDay) {
    fromDay = toDay = days[days.length - 1];
  }
  return { from: fromDay.from, to: toDay.to };
}

// Attach مراجعة صغرى and مراجعة كبرى to a generated schedule, depending on plan type:
//   حفظ           -> adds كبرى only
//   مراجعة        -> adds صغرى only
//   مراجعة وحفظ   -> adds both
//
// مراجعة صغرى (near review): the most recent material — walk backward from yesterday,
// accumulating pages, until at least MINOR_MIN_PAGES (5) is covered. Minimum 5 pages,
// can be more if a single day's chunk was smaller than 5.
//
// مراجعة كبرى (far/comprehensive review): a fixed MAJOR_CHUNK_PAGES (5) slice, rotating
// through the entire cumulative pool covered so far — reviewed before starting today's
// new حفظ, so over time every previously-covered page gets revisited on a rolling cycle.
function attachReviewTracks(schedule, type, majorChunkPages) {
  const needsMinor = type === "مراجعة" || type === "مراجعة وحفظ";
  const needsMajor = type === "حفظ" || type === "مراجعة وحفظ";
  const MINOR_MIN_PAGES = 5;
  const MAJOR_CHUNK_PAGES = Math.max(5, majorChunkPages || 5);
  return schedule.map((day, i) => {
    const extra = {};
    if (needsMajor && i > 0) {
      // تثبيت trails a fixed MAJOR_CHUNK_PAGES behind today's حفظ frontier — not a
      // rotating cycle. Whatever was memorized today naturally becomes تثبيت material
      // once the frontier has advanced MAJOR_CHUNK_PAGES pages past it.
      const coveredSoFar = schedule.slice(0, i);
      const totalPages = coveredSoFar.reduce((s, d) => s + (d.amount || 0), 0);
      if (totalPages > 0) {
        const offset = Math.max(0, totalPages - MAJOR_CHUNK_PAGES);
        extra.majorReview = pageOffsetRange(coveredSoFar, offset, MAJOR_CHUNK_PAGES);
      }
    }
    if (needsMinor && i > 0) {
      let sum = 0;
      let startIdx = i - 1;
      for (let j = i - 1; j >= 0; j--) {
        sum += schedule[j].amount || 0;
        startIdx = j;
        if (sum >= MINOR_MIN_PAGES) break;
      }
      extra.minorReview = { from: schedule[startIdx].from, to: schedule[i - 1].to };
    }
    return { ...day, ...extra };
  });
}

// Merge an independently-configured مراجعة صغرى track into the main (حفظ) schedule,
// matching by date. Used for "مراجعة وحفظ" plans where صغرى has its own separate
// range instead of being auto-derived from حفظ.
function mergeIndependentMinorReview(mainSchedule, reviewSchedule) {
  const byDate = new Map(reviewSchedule.map((d) => [d.date, d]));
  return mainSchedule.map((day) => {
    const rv = byDate.get(day.date);
    if (!rv) return day;
    return { ...day, minorReview: { from: rv.from, to: rv.to, fromAyah: rv.fromAyah, toAyah: rv.toAyah } };
  });
}

// Independent مراجعة صغرى schedule: reads من startSurah (e.g. الناس) إلى targetSurah
// (e.g. الكهف). Every study day gets a real, non-trivial chunk (never a gap day) —
// the pace is at least minDailyPages/day, so the range is guaranteed to be covered
// in full at least once ("الإجباري مرة وحدة"); if that pace finishes before the plan
// ends, it wraps back to the start and keeps going ("أو أكثر").
function generateCyclingMinorReview({ startSurah, targetSurah, durationDays, startDate, offDays, minDailyPages = 5 }) {
  const dates = buildDates(startDate, durationDays, offDays);
  const nDays = dates.length || 1;
  const totalPages = pagesBetweenSurahs(targetSurah, startSurah);
  if (totalPages <= 0) return [];
  const pace = Math.max(totalPages / nDays, minDailyPages);

  let cumInCycle = 0;
  return dates.map((date) => {
    const remaining = totalPages - cumInCycle;
    const take = Math.min(pace, remaining > 1e-9 ? remaining : pace);
    const fromOffset = cumInCycle >= totalPages - 1e-9 ? 0 : cumInCycle;
    const toOffset = Math.min(fromOffset + take, totalPages);
    const fromPoint = fromOffset <= 1e-9 ? { surah: startSurah, ayah: 1 } : reverseAdvance(startSurah, 1, fromOffset);
    const nextPoint = reverseAdvance(startSurah, 1, toOffset);
    const endPoint = reverseRetreat(nextPoint.surah, nextPoint.ayah);
    cumInCycle = toOffset >= totalPages - 1e-9 ? 0 : toOffset;
    return {
      id: uid(),
      date,
      from: fromPoint.surah,
      to: endPoint.surah,
      fromAyah: fromPoint.ayah,
      toAyah: endPoint.ayah,
      amount: Math.round(take * 100) / 100,
      status: "pending",
      note: "",
    };
  });
}

// Shared date-list builder: walks forward from startDate, skipping weekly off-days,
// until it has collected `durationDays` study-days.
function buildDates(startDate, durationDays, offDays) {
  const days = [];
  let cur = new Date(startDate + "T00:00:00");
  let guard = 0;
  while (days.length < durationDays && guard < durationDays * 4 + 30) {
    const dow = cur.getDay();
    if (!offDays.includes(dow)) {
      days.push(toDateStr(cur));
    }
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return days;
}

// Real page-weight per surah: each Mushaf page's "1 page" credit is split evenly among
// the surah(s) present on it. A surah that spans several pages alone earns ~1 per page;
// short surahs sharing a page (Juz 30) each earn a fair fraction. Sums to exactly 604,
// so a page budget in reverse mode means the same thing as a page budget in forward mode.
const SURAH_PAGES = (() => {
  const weights = new Array(115).fill(0);
  for (let p = 1; p <= 604; p++) {
    const info = PA[p];
    if (!info) continue;
    const count = info.surahEnd - info.surahStart + 1;
    const share = 1 / count;
    for (let s = info.surahStart; s <= info.surahEnd; s++) weights[s] += share;
  }
  return weights;
})();

const JUZ30_PAGES = Math.round(SURAH_PAGES.slice(78, 115).reduce((a, b) => a + b, 0));

// Walk forward through ayat starting at (surah, ayah), consuming `pages` worth of content
// using each surah's own ayat-per-page rate, moving to the next LOWER surah number (never
// below 2 / Al-Baqarah) once a surah is exhausted. This lets a single long surah span many
// days — it is never forced whole into one day — while a fresh surah always starts a day
// at its ayah 1 (never mid-surah), since the cursor only skips to a new surah when the
// previous one is fully consumed.
function reverseAdvance(surah, ayah, pages) {
  let s = surah;
  let a = ayah;
  let remaining = pages;
  while (remaining > 1e-9 && s >= 2) {
    const totalAyahS = SURAH_AYAH[s];
    const pagesOfS = SURAH_PAGES[s] || 0.0001;
    const ayahsPerPage = totalAyahS / pagesOfS;
    const remainingAyahInS = totalAyahS - a + 1;
    const remainingPagesInS = remainingAyahInS / ayahsPerPage;
    if (remainingPagesInS <= remaining + 1e-9) {
      remaining -= remainingPagesInS;
      s -= 1;
      a = 1;
    } else {
      const take = Math.max(1, Math.min(remainingAyahInS, Math.round(remaining * ayahsPerPage)));
      a += take;
      remaining = 0;
    }
  }
  if (s < 2) {
    s = 2;
    a = 1;
  }
  return { surah: s, ayah: a };
}

// One ayah before a given cursor position (mirrors retreatAyah, but for the reverse
// walk where crossing a surah boundary means the PREVIOUS surah had a HIGHER number).
function reverseRetreat(surah, ayah) {
  if (ayah > 1) return { surah, ayah: ayah - 1 };
  const prevSurah = surah + 1;
  return { surah: prevSurah, ayah: SURAH_AYAH[prevSurah] || 1 };
}

// True pages consumed so far walking backward from startSurah's ayah 1 down to (curSurah, curAyah).
function reversePagesConsumed(startSurah, curSurah, curAyah) {
  let total = 0;
  for (let s = startSurah; s > curSurah; s--) total += SURAH_PAGES[s];
  const pagesOfCur = SURAH_PAGES[curSurah] || 0.0001;
  total += (curAyah - 1) / (SURAH_AYAH[curSurah] / pagesOfCur);
  return total;
}

// Given a starting surah and a page budget, find where the range would end (surah + ayah),
// walking backward and letting long surahs span the full budget. Used for the live preview.
// Reverse plans stop at Al-Baqarah (2) — Al-Fatiha is left out, since it's normally
// already known / handled separately from a systematic reverse hifظ plan.
function surahRangeForPages(startSurah, totalPages) {
  const surahs = [];
  for (let s = startSurah; s >= 2; s--) surahs.push(s);
  const available = surahs.reduce((sum, s) => sum + SURAH_PAGES[s], 0);
  const targetPages = Math.min(totalPages, available);
  const next = reverseAdvance(startSurah, 1, targetPages);
  const end = reverseRetreat(next.surah, next.ayah);
  return { endSurah: end.surah, endAyah: end.ayah, pagesUsed: Math.round(targetPages) };
}

// Real page-equivalent spanned by an explicit surah range (inclusive), e.g. from Ghafir(40)
// down to Rum(30). Used when the person specifies both a start and a stop point directly.
function pagesBetweenSurahs(fromSurah, toSurah) {
  const lo = Math.max(Math.min(fromSurah, toSurah), 2);
  const hi = Math.max(fromSurah, toSurah);
  let sum = 0;
  for (let s = lo; s <= hi; s++) sum += SURAH_PAGES[s];
  return Math.round(sum * 100) / 100;
}

// Reverse mode: walk backward through the surahs starting at `startSurah` (e.g. An-Nas, 114)
// toward Al-Baqarah, budgeting real Mushaf pages per day (same "عدد الصفحات" unit as forward
// plans). A long surah can span several days; a day only ever starts a new surah at its
// ayah 1 (never mid-surah), since the cursor naturally lands there once a surah finishes.
function generateReverseSchedule({ totalUnits, durationDays, startDate, offDays, startSurah }) {
  const dates = buildDates(startDate, durationDays, offDays);
  const nDays = dates.length || 1;

  const surahs = [];
  for (let s = startSurah; s >= 2; s--) surahs.push(s);
  const available = surahs.reduce((sum, s) => sum + SURAH_PAGES[s], 0);
  const targetPages = Math.min(totalUnits, available);

  // Same pacing philosophy as forward mode: work in half-page units and let
  // distributeUnits decide which days are "active" (skipping the rest evenly)
  // instead of forcing every single day to carry at least 1 ayah.
  const totalHalf = Math.max(0, Math.round(targetPages * 2));
  const amounts = distributeUnits(totalHalf, nDays);

  const result = [];
  let curSurah = startSurah;
  let curAyah = 1;
  let accumPages = 0;

  dates.forEach((date, i) => {
    const halfAmount = amounts[i];
    if (halfAmount <= 0) return; // no target this day — skip rather than force 1 ayah
    if (curSurah <= 2 && curAyah >= SURAH_AYAH[2]) return;

    const pagesForDay = halfAmount / 2;
    const fromSurah = curSurah;
    const fromAyah = curAyah;
    const next = reverseAdvance(curSurah, curAyah, pagesForDay);
    const end = reverseRetreat(next.surah, next.ayah);

    result.push({
      id: uid(),
      date,
      from: fromSurah,
      to: end.surah,
      fromAyah,
      toAyah: end.ayah,
      amount: Math.round((reversePagesConsumed(startSurah, next.surah, next.ayah) - accumPages) * 100) / 100,
      status: "pending",
      note: "",
    });

    curSurah = next.surah;
    curAyah = next.ayah;
    accumPages = reversePagesConsumed(startSurah, curSurah, curAyah);
  });

  // Content finished before the plan duration ran out — keep the remaining days busy
  // with a cycling مراجعة of everything covered so far, rather than leaving them empty.
  if (result.length > 0) {
    const coveredDays = result.slice();
    const totalCovered = coveredDays.reduce((s, d) => s + d.amount, 0);
    if (totalCovered > 0) {
      const REVIEW_CHUNK = Math.max(0.5, Math.min(totalCovered, 1));
      let reviewOffset = 0;
      dates.forEach((date, i) => {
        if (amounts[i] > 0) return; // already has content
        const range = pageOffsetRange(coveredDays, reviewOffset % totalCovered, REVIEW_CHUNK);
        result.push({
          id: uid(),
          date,
          from: range.from,
          to: range.to,
          amount: REVIEW_CHUNK,
          status: "pending",
          note: "",
          isReview: true,
        });
        reviewOffset += REVIEW_CHUNK;
      });
      result.sort((a, b) => (a.date < b.date ? -1 : 1));
    }
  }

  return result;
}

/* ---------------------------------------------------------------
   Storage helpers
----------------------------------------------------------------*/
async function loadPlans() {
  try {
    const res = await window.storage.get("plans", false);
    return res ? JSON.parse(res.value) : [];
  } catch {
    return [];
  }
}
async function savePlans(plans) {
  try {
    await window.storage.set("plans", JSON.stringify(plans), false);
  } catch {
    /* best-effort */
  }
}
async function loadActiveId() {
  try {
    const res = await window.storage.get("activeId", false);
    return res ? res.value : null;
  } catch {
    return null;
  }
}
async function saveActiveId(id) {
  try {
    await window.storage.set("activeId", id || "", false);
  } catch {
    /* best-effort */
  }
}

async function loadRole() {
  try {
    const res = await window.storage.get("role", false);
    return res ? res.value : null;
  } catch {
    return null;
  }
}
async function saveRole(role) {
  try {
    await window.storage.set("role", role, false);
  } catch {
    /* best-effort */
  }
}

// Short, easy-to-read/share code, e.g. "K7X2QF".
function genShareCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// Publish/update a plan under its share code in SHARED storage, so a teacher who has
// the code can read it. Only the plan's data is shared — not the student's other plans.
async function pushSharedPlan(plan) {
  if (!plan.shareCode) return;
  try {
    await window.storage.set(`shared-plan:${plan.shareCode}`, JSON.stringify(plan), true);
  } catch {
    /* best-effort */
  }
}

async function fetchSharedPlan(code) {
  try {
    const res = await window.storage.get(`shared-plan:${code.trim().toUpperCase()}`, true);
    return res ? JSON.parse(res.value) : null;
  } catch {
    return null;
  }
}

// The list of student codes a teacher is following — personal to the teacher's account.
async function loadFollowedCodes() {
  try {
    const res = await window.storage.get("followedCodes", false);
    return res ? JSON.parse(res.value) : [];
  } catch {
    return [];
  }
}
async function saveFollowedCodes(codes) {
  try {
    await window.storage.set("followedCodes", JSON.stringify(codes), false);
  } catch {
    /* best-effort */
  }
}

// This app has no real backend/authentication server — it's a client-side artifact.
// This code is a soft gate to separate teacher/student entry points, not real security
// (anyone reading the source can see it). Change it here if you need a different one.
const TEACHER_ACCESS_CODE = "TEACHER2026";

/* ---------------------------------------------------------------
   Progress ring
----------------------------------------------------------------*/
function ProgressRing({ pct, size = 128 }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(Math.max(pct, 0), 100) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.panelLighter} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.gold}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: C.parchment, fontFamily: "'Aref Ruqaa', serif" }}>
          {pct}%
        </span>
        <span className="text-[11px]" style={{ color: C.muted }}>
          مكتمل
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Create Plan form
----------------------------------------------------------------*/
function CreatePlanModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("حفظ");
  const [direction, setDirection] = useState("forward"); // forward | reverse
  const [startPage, setStartPage] = useState(1);
  const [startSurah, setStartSurah] = useState(114);
  const [hasEndPoint, setHasEndPoint] = useState(true);
  const [stopPage, setStopPage] = useState(30);
  const [stopSurah, setStopSurah] = useState(104);
  const [dailyPace, setDailyPace] = useState(0.5); // used only when there's no stop point
  const [durationDays, setDurationDays] = useState(30);
  const [startDate, setStartDate] = useState(todayStr());
  const [offDays, setOffDays] = useState([5]); // default: Friday off
  const [tathbitPages, setTathbitPages] = useState(5); // مراجعة كبرى/تثبيت chunk size
  // Independent مراجعة صغرى range, used only for "مراجعة وحفظ" plans — separate
  // from حفظ, defaults to reverse (من الناس) with a required user-picked stop point.
  const [reviewStopSurah, setReviewStopSurah] = useState(100);
  const [step, setStep] = useState(0);

  const toggleOff = (i) =>
    setOffDays((cur) => (cur.includes(i) ? cur.filter((d) => d !== i) : [...cur, i]));

  // حفظ plans (new memorization) can be tracked in half-pages ("وجه") — starting at
  // 0.5 and up. Pure مراجعة plans keep whole-page granularity.
  const unitStep = type === "مراجعة" ? 1 : 0.5;

  // --- forward-mode (half-page / "وجه" based) derived values ---
  // Amount comes from an explicit start→stop page range if set, otherwise from an
  // open-ended daily pace applied across the whole plan duration.
  const forwardTotalUnits = hasEndPoint ? Math.max(unitStep, stopPage - startPage + 1) : dailyPace * durationDays;
  const startHp = (startPage - 1) * 2 + 1;
  const totalHalfUnits = Math.max(0, Math.round(forwardTotalUnits * 2));
  const clampedHalfUnits = Math.min(totalHalfUnits, 1208 - startHp + 1);
  const endHp = startHp + Math.max(clampedHalfUnits, 1) - 1;
  const clampedTotal = clampedHalfUnits / 2; // in pages, may be fractional (e.g. 0.5)
  const endPage = pageOfHp(endHp);
  const startLabel = halfPageRangeLabel(startHp, startHp);
  const endLabel = halfPageRangeLabel(endHp, endHp);

  // --- reverse-mode derived values ---
  const reverseTotalUnits = hasEndPoint ? pagesBetweenSurahs(startSurah, stopSurah) : dailyPace * durationDays;
  const reversePreview = surahRangeForPages(startSurah, reverseTotalUnits);
  const previewEndSurah = hasEndPoint ? Math.max(Math.min(stopSurah, startSurah), 2) : reversePreview.endSurah;
  const previewEndAyah = hasEndPoint ? SURAH_AYAH[previewEndSurah] : reversePreview.endAyah;
  const clampedReversePages = hasEndPoint ? reverseTotalUnits : reversePreview.pagesUsed;

  // --- independent مراجعة صغرى range (من الناس إلى نقطة يحددها), for "مراجعة وحفظ" plans only ---
  const reviewTotalUnits = pagesBetweenSurahs(114, reviewStopSurah);
  const reviewEndAyah = SURAH_AYAH[reviewStopSurah];

  const submit = () => {
    let schedule;
    if (direction === "forward") {
      schedule = attachReviewTracks(
        generateSchedule({ totalUnits: clampedTotal, durationDays, startDate, offDays, startPage }),
        type,
        tathbitPages
      );
    } else {
      schedule = attachReviewTracks(
        generateReverseSchedule({ totalUnits: clampedReversePages, durationDays, startDate, offDays, startSurah }),
        type,
        tathbitPages
      );
    }
    // "مراجعة وحفظ" plans get an independent صغرى track (من الناس إلى نقطة يحددها)
    // instead of the auto-derived "yesterday's حفظ" version. It cycles so every day
    // gets real content and the target is reached at least once.
    if (type === "مراجعة وحفظ") {
      const reviewSchedule = generateCyclingMinorReview({
        startSurah: 114,
        targetSurah: reviewStopSurah,
        durationDays,
        startDate,
        offDays,
      });
      schedule = mergeIndependentMinorReview(schedule, reviewSchedule);
    }
    onCreate({
      id: uid(),
      title: title.trim(),
      type,
      direction,
      startPage,
      startSurah,
      totalUnits: direction === "forward" ? clampedTotal : clampedReversePages,
      reviewStopSurah: type === "مراجعة وحفظ" ? reviewStopSurah : undefined,
      durationDays,
      startDate,
      offDays,
      schedule,
      createdAt: Date.now(),
    });
  };

  const STEP_LABELS = {
    type: "النوع",
    direction: "الاتجاه",
    hifz: "الحفظ",
    muraja: "المراجعة",
    tathbit: "التثبيت",
    schedule: "المدة والاسم",
    review: "عرض الخطة",
  };
  const needsHifzStep = type === "حفظ" || type === "مراجعة وحفظ";
  const needsMurajaStep = type === "مراجعة" || type === "مراجعة وحفظ";
  const needsTathbitStep = type === "حفظ" || type === "مراجعة وحفظ";
  const stepKeys = [
    "type",
    "schedule",
    "direction",
    ...(needsHifzStep ? ["hifz"] : []),
    ...(needsMurajaStep ? ["muraja"] : []),
    ...(needsTathbitStep ? ["tathbit"] : []),
    "review",
  ];
  const safeStep = Math.min(step, stepKeys.length - 1);
  const currentKey = stepKeys[safeStep];
  const STEPS = stepKeys.map((k) => STEP_LABELS[k]);
  const lastStep = STEPS.length - 1;

  // For "مراجعة وحفظ" plans, the range/pace form (from/to/pages) configures حفظ.
  // For a pure "مراجعة" plan, that same form configures المراجعة range directly
  // (there's no separate حفظ track), so the "muraja" step reuses it too.
  const rangeFormIsMuraja = currentKey === "muraja" && type === "مراجعة";

  const canProceed =
    currentKey === "hifz"
      ? direction === "forward"
        ? startPage >= 1 && startPage <= 604 && (hasEndPoint ? stopPage >= startPage && clampedTotal > 0 : dailyPace > 0)
        : startSurah >= 2 && startSurah <= 114 && (hasEndPoint ? stopSurah >= 2 && stopSurah <= startSurah : dailyPace > 0)
      : rangeFormIsMuraja
      ? direction === "forward"
        ? startPage >= 1 && startPage <= 604 && (hasEndPoint ? stopPage >= startPage && clampedTotal >= 5 : dailyPace > 0)
        : startSurah >= 2 && startSurah <= 114 && (hasEndPoint ? stopSurah >= 2 && stopSurah <= startSurah && clampedReversePages >= 5 : dailyPace > 0)
      : currentKey === "muraja" && !rangeFormIsMuraja
      ? reviewStopSurah >= 2 && reviewStopSurah < 114 && reviewTotalUnits >= 5
      : currentKey === "tathbit"
      ? tathbitPages >= 5
      : currentKey === "schedule"
      ? durationDays > 0 && !!startDate && title.trim().length > 0
      : true;

  const belowMurajaMin = rangeFormIsMuraja && hasEndPoint && (direction === "forward" ? clampedTotal < 5 : clampedReversePages < 5);
  const belowReviewMin = currentKey === "muraja" && !rangeFormIsMuraja && reviewTotalUnits < 5;

  const goNext = () => {
    if (currentKey === "type" && !title.trim()) {
      setTitle(type === "حفظ" ? "خطة حفظ" : type === "مراجعة" ? "خطة مراجعة" : "خطة حفظ ومراجعة");
    }
    setStep((s) => Math.min(s + 1, lastStep));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const TypeCard = ({ value, title: t, desc, icon }) => (
    <button
      onClick={() => setType(value)}
      className="relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center transition"
      style={{
        aspectRatio: "1 / 1",
        background: type === value ? C.panelLighter : C.ink,
        border: `1.5px solid ${type === value ? C.gold : C.panelLighter}`,
      }}
    >
      {type === value && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ position: "absolute", top: 8, insetInlineStart: 8, background: C.gold }}
        >
          <Check size={12} color={C.ink2} strokeWidth={3} />
        </div>
      )}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: type === value ? C.gold : C.panelLighter }}
      >
        {React.cloneElement(icon, { color: type === value ? C.ink2 : C.muted, size: 22 })}
      </div>
      <div className="text-sm font-bold" style={{ color: type === value ? C.goldSoft : C.parchment }}>
        {t}
      </div>
      <div className="text-[10px] leading-tight px-1" style={{ color: C.muted }}>
        {desc}
      </div>
    </button>
  );

  const DirectionCard = ({ value, title: t, desc }) => (
    <button
      onClick={() => setDirection(value)}
      className="w-full text-right rounded-xl p-4 flex items-center justify-between gap-3 transition"
      style={{
        background: direction === value ? C.panelLighter : C.ink,
        border: `1px solid ${direction === value ? C.gold : C.panelLighter}`,
      }}
    >
      <div>
        <div className="text-sm font-bold" style={{ color: direction === value ? C.goldSoft : C.parchment }}>
          {t}
        </div>
        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
          {desc}
        </div>
      </div>
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: direction === value ? C.gold : "transparent", border: `1px solid ${direction === value ? C.gold : C.panelLighter}` }}
      >
        {direction === value && <Check size={12} color={C.ink2} strokeWidth={3} />}
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto khittah-view-fade" style={{ background: C.ink }} dir="rtl">
      <header
        className="px-5 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ background: `${C.ink}f2`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.panelLighter}` }}
      >
        <h2 className="text-xl" style={{ color: C.goldSoft, fontFamily: "'Aref Ruqaa', serif" }}>
          خطة قرآنية جديدة
        </h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5" aria-label="إغلاق">
          <X size={20} color={C.muted} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5 pb-28">
        {/* Step progress */}
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition"
              style={{
                background: i < safeStep ? C.gold : i === safeStep ? C.panelLighter : C.ink,
                color: i < safeStep ? C.ink2 : i === safeStep ? C.goldSoft : C.muted,
                border: `1.5px solid ${i <= safeStep ? C.gold : C.panelLighter}`,
              }}
            >
              {i < safeStep ? <Check size={12} strokeWidth={3} /> : i + 1}
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: C.panelLighter }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${((safeStep + 1) / STEPS.length) * 100}%`, background: C.gold }}
          />
        </div>
        <p className="text-xs mb-4" style={{ color: C.muted }}>
          خطوة {safeStep + 1} من {STEPS.length} — {STEPS[safeStep]}
        </p>

        <div>
          <div key={currentKey} className="space-y-4 khittah-fade">
            {currentKey === "type" && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  ما نوع الخطة؟
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  حدّد إن كانت الخطة لحفظ جديد، أو مراجعة، أو الاثنين معًا.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <TypeCard value="حفظ" title="حفظ" desc="حفظ جديد + تثبيت" icon={<BookOpen />} />
                  <TypeCard value="مراجعة" title="مراجعة" desc="مراجعة صغرى وتثبيت" icon={<RotateCcw />} />
                  <TypeCard value="مراجعة وحفظ" title="الاثنين" desc="حفظ + صغرى + تثبيت" icon={<Layers />} />
                </div>
              </div>
            )}

            {currentKey === "direction" && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  من أين تبدأ الخطة؟
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  يمكنك البدء من أول القرآن، أو من آخره وترجع للخلف.
                </p>
                <div className="space-y-2">
                  <DirectionCard value="forward" title="من البداية (الفاتحة ←)" desc="تتقدّم صفحة بعد صفحة من حيث تختار" />
                  <DirectionCard value="reverse" title="من النهاية (الناس ← البقرة)" desc="ترجع للخلف سورة كاملة كل مرة، حتى سورة البقرة" />
                </div>
              </div>
            )}

            {(currentKey === "hifz" || rangeFormIsMuraja) && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  {currentKey === "hifz" ? "الحفظ: من وين لوين؟" : "المراجعة: من وين لوين؟"}
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  {direction === "forward" ? "نقطة البداية، ونقطة توقف اختيارية." : "السورة التي تبدأ منها، ونقطة توقف اختيارية."}
                </p>

                {direction === "forward" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
                        هل تريد تحديد نقطة توقف؟
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setHasEndPoint(true)}
                          className="rounded-lg py-2 text-xs transition"
                          style={{
                            background: hasEndPoint ? C.gold : C.panel,
                            color: hasEndPoint ? "#fff" : C.parchmentDim,
                            fontWeight: hasEndPoint ? 700 : 400,
                            border: `1px solid ${hasEndPoint ? C.gold : C.panelLighter}`,
                          }}
                        >
                          نعم، حتى صفحة معيّنة
                        </button>
                        <button
                          onClick={() => setHasEndPoint(false)}
                          className="rounded-lg py-2 text-xs transition"
                          style={{
                            background: !hasEndPoint ? C.gold : C.panel,
                            color: !hasEndPoint ? "#fff" : C.parchmentDim,
                            fontWeight: !hasEndPoint ? 700 : 400,
                            border: `1px solid ${!hasEndPoint ? C.gold : C.panelLighter}`,
                          }}
                        >
                          لا، تستمر طول المدة
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl p-3 space-y-3" style={{ background: C.panelLight, border: `1px solid ${C.panelLighter}` }}>
                      <NumberStepper
                        label="من صفحة"
                        value={startPage}
                        onChange={(v) => setStartPage(Math.min(604, Math.max(1, v || 1)))}
                        min={1}
                        max={604}
                        step={1}
                      />

                      <div key={hasEndPoint ? "fwd-stop" : "fwd-pace"} className="khittah-fade">
                        {hasEndPoint ? (
                          <NumberStepper
                            label="إلى صفحة"
                            value={stopPage}
                            onChange={(v) => setStopPage(Math.min(604, Math.max(startPage, v || startPage)))}
                            min={startPage}
                            max={604}
                            step={1}
                          />
                        ) : (
                          <NumberStepper
                            label="المعدل اليومي (صفحة)"
                            value={dailyPace}
                            onChange={(v) => setDailyPace(Math.max(unitStep, v))}
                            min={unitStep}
                            step={unitStep}
                            hint="الخطة تستمر حتى نهاية المدة اللي تحددها بالخطوة الجاية"
                          />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStartPage(1);
                        setHasEndPoint(true);
                        setStopPage(604);
                      }}
                      className="w-full rounded-lg py-2 text-xs flex items-center justify-center gap-1.5"
                      style={{ background: "transparent", color: C.goldSoft, border: `1px dashed ${C.goldDim}` }}
                    >
                      <Rub size={11} color={C.goldSoft} /> تعبئة تلقائية: القرآن كاملاً (604 صفحة)
                    </button>

                    {clampedTotal > 0 && (
                      <div className="rounded-lg px-3 py-2.5 text-xs leading-6" style={{ background: C.gold, color: "#fff" }}>
                        <div>
                          يبدأ من: <b>{startLabel}</b> (صفحة {startPage})
                        </div>
                        <div>
                          {hasEndPoint ? "ينتهي عند" : "بهذه المدة، يصل تقريبًا إلى"}: <b>{endLabel}</b> (صفحة {endPage})
                        </div>
                        <div style={{ opacity: 0.9 }}>{juzLabel(startPage, endPage)}</div>
                      </div>
                    )}
                    {belowMurajaMin && (
                      <p className="text-xs" style={{ color: C.brick }}>
                        المراجعة لازم تكون 5 صفحات على الأقل — وسّع النطاق.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
                        هل تريد تحديد نقطة توقف؟
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setHasEndPoint(true)}
                          className="rounded-lg py-2 text-xs transition"
                          style={{
                            background: hasEndPoint ? C.gold : C.panel,
                            color: hasEndPoint ? "#fff" : C.parchmentDim,
                            fontWeight: hasEndPoint ? 700 : 400,
                            border: `1px solid ${hasEndPoint ? C.gold : C.panelLighter}`,
                          }}
                        >
                          نعم، حتى سورة معيّنة
                        </button>
                        <button
                          onClick={() => setHasEndPoint(false)}
                          className="rounded-lg py-2 text-xs transition"
                          style={{
                            background: !hasEndPoint ? C.gold : C.panel,
                            color: !hasEndPoint ? "#fff" : C.parchmentDim,
                            fontWeight: !hasEndPoint ? 700 : 400,
                            border: `1px solid ${!hasEndPoint ? C.gold : C.panelLighter}`,
                          }}
                        >
                          لا، تستمر طول المدة
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl p-3 space-y-3" style={{ background: C.panelLight, border: `1px solid ${C.panelLighter}` }}>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: C.goldSoft }}>
                          ابدأ من سورة
                        </label>
                        <select
                          value={startSurah}
                          onChange={(e) => setStartSurah(Number(e.target.value))}
                          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                          style={{ background: C.ink, color: C.parchment, border: `1px solid ${C.panelLighter}` }}
                        >
                          {Array.from({ length: 113 }, (_, k) => 114 - k).map((s) => (
                            <option key={s} value={s}>
                              {s}. {SURAH_NAMES[s]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div key={hasEndPoint ? "rev-stop" : "rev-pace"} className="khittah-fade">
                        {hasEndPoint ? (
                          <div>
                            <label className="block text-sm mb-1" style={{ color: C.goldSoft }}>
                              قف عند سورة
                            </label>
                            <select
                              value={stopSurah}
                              onChange={(e) => setStopSurah(Number(e.target.value))}
                              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                              style={{ background: C.ink, color: C.parchment, border: `1px solid ${C.panelLighter}` }}
                            >
                              {Array.from({ length: startSurah - 1 }, (_, k) => startSurah - k).map((s) => (
                                <option key={s} value={s}>
                                  {s}. {SURAH_NAMES[s]}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <NumberStepper
                            label="المعدل اليومي (صفحة)"
                            value={dailyPace}
                            onChange={(v) => setDailyPace(Math.max(unitStep, v))}
                            min={unitStep}
                            step={unitStep}
                            hint="الخطة تستمر حتى نهاية المدة اللي تحددها بالخطوة الجاية"
                          />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStartSurah(114);
                        setHasEndPoint(true);
                        setStopSurah(78);
                      }}
                      className="w-full rounded-lg py-2 text-xs flex items-center justify-center gap-1.5"
                      style={{ background: "transparent", color: C.goldSoft, border: `1px dashed ${C.goldDim}` }}
                    >
                      <Rub size={11} color={C.goldSoft} /> تعبئة تلقائية: جزء عمّ كاملاً (الناس ← النبأ)
                    </button>

                    {clampedReversePages > 0 && (
                      <div className="rounded-lg px-3 py-2.5 text-xs leading-6" style={{ background: C.gold, color: "#fff" }}>
                        <div>
                          يبدأ من: <b>سورة {SURAH_NAMES[startSurah]}</b> — الآيات 1 إلى {SURAH_AYAH[startSurah]}
                        </div>
                        <div>
                          {hasEndPoint ? "ينتهي عند" : "بهذه المدة، يصل تقريبًا إلى"}: <b>سورة {SURAH_NAMES[previewEndSurah]}</b> — الآيات 1 إلى {previewEndAyah}
                        </div>
                        <div style={{ opacity: 0.9 }}>≈ {clampedReversePages} صفحة، ويبدأ كل يوم من أول آية في السورة</div>
                      </div>
                    )}
                    {belowMurajaMin && (
                      <p className="text-xs" style={{ color: C.brick }}>
                        المراجعة لازم تكون 5 صفحات على الأقل — اختر سورة توقف أبعد.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentKey === "muraja" && !rangeFormIsMuraja && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  المراجعة الصغرى: من وين لوين؟
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  مستقلة عن الحفظ — تبدأ من الناس، وتحدد إلى وين توقف.
                </p>
                <div className="space-y-3">
                  <div
                    className="rounded-lg px-3 py-2.5 text-sm flex items-center gap-2"
                    style={{ background: C.panelLight, border: `1px solid ${C.panelLighter}`, color: C.goldSoft }}
                  >
                    <RotateCcw size={15} />
                    تبدأ دائمًا من سورة الناس
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: C.muted }}>
                      قف عند سورة
                    </label>
                    <select
                      value={reviewStopSurah}
                      onChange={(e) => setReviewStopSurah(Number(e.target.value))}
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                      style={{ background: C.ink, color: C.parchment, border: `1px solid ${C.panelLighter}` }}
                    >
                      {Array.from({ length: 113 }, (_, k) => 114 - k).map((s) => (
                        <option key={s} value={s}>
                          {s}. {SURAH_NAMES[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  {reviewTotalUnits > 0 && (
                    <div className="rounded-lg px-3 py-2 text-xs leading-6" style={{ background: C.ink, border: `1px solid ${C.panelLighter}`, color: C.parchmentDim }}>
                      <div>
                        يبدأ من: <span style={{ color: C.goldSoft }}>سورة الناس</span> — الآيات 1 إلى {SURAH_AYAH[114]}
                      </div>
                      <div>
                        ينتهي عند: <span style={{ color: C.goldSoft }}>سورة {SURAH_NAMES[reviewStopSurah]}</span> — الآيات 1 إلى {reviewEndAyah}
                      </div>
                      <div style={{ color: C.muted }}>≈ {reviewTotalUnits} صفحة</div>
                    </div>
                  )}
                  {belowReviewMin && (
                    <p className="text-xs" style={{ color: C.brick }}>
                      المراجعة لازم تكون 5 صفحات على الأقل — اختر سورة أبعد.
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentKey === "tathbit" && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  التثبيت: كم صفحة؟
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  التثبيت يدور على كل المحفوظ من الأول، بمقدار ثابت كل يوم، قبل ما تبدأ الحفظ الجديد.
                </p>
                <NumberStepper
                  label="عدد صفحات التثبيت اليومية"
                  value={tathbitPages}
                  onChange={(v) => setTathbitPages(Math.max(5, v))}
                  min={5}
                  step={0.5}
                  hint="أقل شيء 5 صفحات — تقدر تكبّرها أكثر"
                />
              </div>
            )}

            {currentKey === "schedule" && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  المدة والاسم
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  اسم الخطة، مدتها، تاريخ البداية، وأيام الإجازة.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: C.goldSoft }}>
                      اسم الخطة
                    </label>
                    <input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: ختمة حفظ في شهرين"
                      className="w-full rounded-xl px-3.5 py-3 text-sm font-bold outline-none"
                      style={{ background: C.panelLight, color: C.parchment, border: `1.5px solid ${C.gold}` }}
                    />
                  </div>

                  <div className="rounded-xl p-3 grid grid-cols-2 gap-3" style={{ background: C.panelLight, border: `1px solid ${C.panelLighter}` }}>
                    <NumberStepper
                      label="مدة الخطة (أيام)"
                      value={durationDays}
                      onChange={(v) => setDurationDays(Math.max(1, v))}
                      min={1}
                      step={1}
                    />
                    <div>
                      <label className="block text-sm mb-1" style={{ color: C.goldSoft }}>
                        تاريخ البداية
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                        style={{ background: C.ink, color: C.parchment, border: `1px solid ${C.panelLighter}` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: C.panelLight, border: `1px solid ${C.panelLighter}` }}>
                    <label className="block text-sm mb-2" style={{ color: C.goldSoft }}>
                      أيام الإجازة الأسبوعية
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((d) => (
                        <button
                          key={d.i}
                          onClick={() => toggleOff(d.i)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition"
                          style={{
                            background: offDays.includes(d.i) ? C.brick : "#fff",
                            color: offDays.includes(d.i) ? "#fff" : C.parchmentDim,
                            border: `1px solid ${offDays.includes(d.i) ? C.brick : C.panelLighter}`,
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {currentKey === "review" && (
              <div>
                <h3 className="text-base font-semibold mb-1" style={{ color: C.parchment }}>
                  راجع خطتك
                </h3>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  تأكد من التفاصيل قبل الإنشاء.
                </p>
                <div className="rounded-xl p-4 space-y-2.5 text-sm" style={{ background: C.ink, border: `1px solid ${C.panelLighter}` }}>
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>الاسم</span>
                    <span style={{ color: C.parchment }}>{title || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>النوع</span>
                    <span style={{ color: C.parchment }}>{type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>الاتجاه</span>
                    <span style={{ color: C.parchment }}>{direction === "forward" ? "من البداية" : "من النهاية"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>النطاق</span>
                    <span style={{ color: C.goldSoft, textAlign: "left" }}>
                      {direction === "forward"
                        ? `${startLabel} ← ${endLabel}`
                        : `سورة ${SURAH_NAMES[startSurah]} ← سورة ${SURAH_NAMES[previewEndSurah]}`}
                    </span>
                  </div>
                  {!hasEndPoint && (
                    <div className="flex justify-between">
                      <span style={{ color: C.muted }}>نقطة التوقف</span>
                      <span style={{ color: C.parchment }}>غير محددة — تمشي طول المدة</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>عدد الصفحات</span>
                    <span style={{ color: C.parchment }}>{direction === "forward" ? clampedTotal : clampedReversePages}</span>
                  </div>
                  {needsTathbitStep && (
                    <div className="flex justify-between">
                      <span style={{ color: C.muted }}>تثبيت يومي</span>
                      <span style={{ color: C.parchment }}>{tathbitPages} صفحة</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>مدة الخطة</span>
                    <span style={{ color: C.parchment }}>{durationDays} يوم</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>تاريخ البداية</span>
                    <span style={{ color: C.parchment }}>{fmtDate(startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: C.muted }}>أيام الإجازة</span>
                    <span style={{ color: C.parchment }}>
                      {offDays.length ? offDays.map((i) => WEEKDAYS.find((w) => w.i === i)?.label).join("، ") : "لا يوجد"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div
        className="fixed bottom-0 inset-x-0 z-10 px-4 py-3"
        style={{ background: `${C.ink}f2`, backdropFilter: "blur(6px)", borderTop: `1px solid ${C.panelLighter}` }}
      >
        <div className="max-w-2xl mx-auto flex gap-2">
          {safeStep > 0 && (
            <button
              onClick={goBack}
              className="rounded-xl px-4 py-3 text-sm flex items-center gap-1.5"
              style={{ background: "transparent", color: C.parchmentDim, border: `1px solid ${C.panelLighter}` }}
            >
              <ArrowRight size={15} /> رجوع
            </button>
          )}
          {safeStep < lastStep ? (
            <button
              disabled={!canProceed}
              onClick={goNext}
              className="flex-1 rounded-xl py-3 text-sm font-bold transition disabled:opacity-40"
              style={{ background: C.gold, color: C.ink2 }}
            >
              التالي
            </button>
          ) : (
            <button
              onClick={submit}
              className="flex-1 rounded-xl py-3 text-sm font-bold transition"
              style={{ background: C.gold, color: C.ink2 }}
            >
              إنشاء الخطة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Day row
----------------------------------------------------------------*/
function DayRow({ day, isToday, direction, onSetStatus, onNote }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState(day.note);

  const statusColor =
    day.status === "done" ? C.sage : day.status === "missed" ? C.brick : C.panelLighter;

  const isWholeSurahRange = direction === "reverse" && (day.fromAyah || 1) === 1 && (day.toAyah || SURAH_AYAH[day.to]) === SURAH_AYAH[day.to];

  const mainLabel =
    direction === "reverse"
      ? day.from === day.to
        ? isWholeSurahRange
          ? `سورة ${SURAH_NAMES[day.from]}`
          : `سورة ${SURAH_NAMES[day.from]} — آية ${day.fromAyah} إلى ${day.toAyah}`
        : isWholeSurahRange
        ? `من سورة ${SURAH_NAMES[day.from]} إلى سورة ${SURAH_NAMES[day.to]}`
        : `من سورة ${SURAH_NAMES[day.from]} (آية ${day.fromAyah}) إلى سورة ${SURAH_NAMES[day.to]} (آية ${day.toAyah})`
      : halfPageMainLabel(day.from, day.to);

  const subLabel =
    direction === "reverse" ? reverseRangeLabel(day.from, day.to, day.fromAyah, day.toAyah) : halfPageRangeLabel(day.from, day.to);
  const metaLabel = direction === "reverse" ? "" : ` • ${juzLabel(pageOfHp(day.from), pageOfHp(day.to))}`;

  return (
    <div
      className="rounded-2xl px-4 py-3.5 transition"
      style={{
        background: isToday ? C.panelLight : "transparent",
        border: `1px solid ${isToday ? C.gold : "transparent"}`,
      }}
    >
      {day.majorReview && (
        <div className="flex items-center gap-1.5 text-[11px] mb-2 pr-5" style={{ color: C.goldSoft }}>
          <Layers size={11} />
          تثبيت (قبل الحفظ) — {trackLabel(direction, day.majorReview)}
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: statusColor }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="text-[14px] leading-5 truncate" style={{ color: C.parchment }}>
              {day.isReview && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1" style={{ background: C.sage, color: "#fff" }}>
                  مراجعة
                </span>
              )}
              {mainLabel}
              {(direction !== "reverse" || isWholeSurahRange) && <span style={{ color: C.muted }}> — {subLabel}</span>}
            </div>
            <div className="text-xs leading-5 mt-0.5" style={{ color: C.muted }}>
              {fmtDate(day.date)} {isToday && "• اليوم"}
              {metaLabel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 no-print">
          <button
            onClick={() => setNoteOpen((o) => !o)}
            className="p-2 rounded-xl hover:bg-white/5"
            aria-label="ملاحظة"
          >
            <StickyNote size={16} color={day.note ? C.goldSoft : C.muted} />
          </button>
          <button
            onClick={() => onSetStatus(day.id, day.status === "done" ? "pending" : "done")}
            className="p-2 rounded-xl transition"
            style={{ background: day.status === "done" ? C.sage : "transparent" }}
            aria-label="سمعت"
          >
            <Check size={16} color={day.status === "done" ? C.ink2 : C.muted} />
          </button>
          <button
            onClick={() => onSetStatus(day.id, day.status === "missed" ? "pending" : "missed")}
            className="p-2 rounded-xl transition"
            style={{ background: day.status === "missed" ? C.brick : "transparent" }}
            aria-label="لم أنجز"
          >
            <X size={16} color={day.status === "missed" ? C.parchment : C.muted} />
          </button>
        </div>
      </div>

      {day.minorReview && (
        <div className="mt-2 pr-5 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: C.sage }}>
            <RotateCcw size={11} />
            مراجعة صغرى — {trackLabel(direction, day.minorReview)}
          </div>
        </div>
      )}

      {noteOpen && (
        <div className="mt-2 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="أضف ملاحظة لهذا اليوم..."
            className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none"
            style={{ background: C.ink, color: C.parchment, border: `1px solid ${C.panelLighter}` }}
          />
          <button
            onClick={() => {
              onNote(day.id, draft);
              setNoteOpen(false);
            }}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: C.gold, color: C.ink2 }}
          >
            حفظ
          </button>
        </div>
      )}
    </div>
  );
}

// Collapsible week section for the full schedule — keeps long plans scannable instead
// of one long flat list. Opens by default only for the week containing today (or the
// first week with unfinished days), others start collapsed.
// Report table: date / حفظ / تثبيت / مراجعة / الحالة, blue header, white rows,
// with a full-width "إجازة" row for weekly off-days — used for both the on-screen
// preview and the PDF/print output so they match exactly.
function PlanReportTable({ activePlan }) {
  const schedule = activePlan.schedule;
  if (!schedule || schedule.length === 0) return null;
  const direction = activePlan.direction;

  const rows = useMemo(() => {
    const byDate = new Map(schedule.map((d) => [d.date, d]));
    const start = new Date(schedule[0].date + "T00:00:00");
    const end = new Date(schedule[schedule.length - 1].date + "T00:00:00");
    const list = [];
    let cur = new Date(start);
    while (cur <= end) {
      const dateStr = toDateStr(cur);
      const dow = cur.getDay();
      if (byDate.has(dateStr)) {
        list.push({ type: "day", date: dateStr, day: byDate.get(dateStr) });
      } else if ((activePlan.offDays || []).includes(dow)) {
        list.push({ type: "off", date: dateStr });
      } else {
        // Not an official off-day, but no content landed here either (the plan's
        // pace is sparser than every day) — show it plainly instead of vanishing.
        list.push({ type: "gap", date: dateStr });
      }
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  }, [schedule, activePlan.offDays]);

  const NAVY = "#0B3559";
  const BLUE = "#1F5D93";
  const CHIP_BG = "#DCEBF8";
  const th = { padding: "13px 8px", fontSize: 13, fontWeight: 700, textAlign: "center", whiteSpace: "nowrap", borderInlineStart: `1px solid rgba(255,255,255,0.3)` };
  const td = { padding: "10px 6px", textAlign: "center", verticalAlign: "middle", borderInlineStart: `1px solid ${CHIP_BG}` };
  const chip = {
    display: "inline-block",
    width: "100%",
    background: CHIP_BG,
    border: `1.5px solid ${BLUE}`,
    borderRadius: 9,
    padding: "7px 5px",
    fontSize: 11.5,
    fontWeight: 700,
    color: NAVY,
    lineHeight: 1.45,
  };
  const dashChip = { ...chip, background: "#F3F6FA", border: "1.5px solid #B9CEE1", color: "#7E93AA", fontWeight: 500 };

  const mainCell = (day) =>
    direction === "reverse" ? trackLabel(direction, { from: day.from, to: day.to }) : halfPageMainLabel(day.from, day.to);

  return (
    <div style={{ background: "#fff", color: NAVY, borderRadius: 16, overflow: "hidden", border: `3px solid ${NAVY}` }}>
      <div style={{ background: NAVY, color: "#fff", padding: "20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>خطة: {activePlan.title}</div>
          <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 3 }}>
            {activePlan.type} — {activePlan.direction === "reverse" ? "من النهاية" : "من البداية"}
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Rub size={24} color="#fff" />
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: BLUE, color: "#fff" }}>
            <th style={th}>التاريخ</th>
            <th style={th}>الحفظ</th>
            <th style={th}>تثبيت</th>
            <th style={th}>مراجعة</th>
            <th style={th}>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) =>
            r.type === "off" ? (
              <tr key={r.date} className="khittah-report-row">
                <td colSpan={5} style={{ background: "#CFE3F5", textAlign: "center", padding: "10px", fontSize: 12.5, fontWeight: 700, color: NAVY, borderTop: `1.5px solid ${BLUE}`, borderBottom: `1.5px solid ${BLUE}` }}>
                  إجازة — {fmtDate(r.date)}
                </td>
              </tr>
            ) : r.type === "gap" ? (
              <tr key={r.date} className="khittah-report-row">
                <td colSpan={5} style={{ background: "#F3F6FA", textAlign: "center", padding: "9px", fontSize: 12, color: "#8697AC", borderTop: `1px dashed #C7D6E5`, borderBottom: `1px dashed #C7D6E5` }}>
                  لا يوجد وِرد — {fmtDate(r.date)}
                </td>
              </tr>
            ) : (
              <tr key={r.date} className="khittah-report-row" style={{ background: i % 2 ? "#EAF2FA" : "#fff", borderBottom: `1px solid ${CHIP_BG}` }}>
                <td style={{ ...td, whiteSpace: "nowrap", fontWeight: 700, color: NAVY, fontSize: 12.5 }}>{fmtDate(r.date)}</td>
                <td style={td}>
                  <span style={chip}>{mainCell(r.day)}</span>
                </td>
                <td style={td}>
                  <span style={r.day.majorReview ? chip : dashChip}>{r.day.majorReview ? trackLabel(direction, r.day.majorReview) : "\u00A0"}</span>
                </td>
                <td style={td}>
                  <span style={r.day.minorReview ? chip : dashChip}>{r.day.minorReview ? trackLabel(direction, r.day.minorReview) : "\u00A0"}</span>
                </td>
                <td style={td}>
                  <span
                    style={{
                      ...chip,
                      background: r.day.status === "done" ? "#DFF3E9" : r.day.status === "missed" ? "#FBE4DE" : "transparent",
                      border: `1.5px solid ${r.day.status === "done" ? "#3E9C6E" : r.day.status === "missed" ? "#D2664D" : "#B9CEE1"}`,
                      color: r.day.status === "done" ? "#227A4F" : r.day.status === "missed" ? "#B14A32" : NAVY,
                      fontWeight: 700,
                    }}
                  >
                    {r.day.status === "done" ? "✓ تمّ" : r.day.status === "missed" ? "غياب" : "\u00A0"}
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div style={{ background: NAVY, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10.5, opacity: 0.9 }}>
        <span>من تطبيق خِطّة</span>
        <span>{rows.filter((r) => r.type === "day").length} يوم</span>
      </div>
    </div>
  );
}

function WeekGroup({ weekLabel, days, direction, defaultOpen, onSetStatus, onNote }) {
  const [open, setOpen] = useState(defaultOpen);
  const doneCount = days.filter((d) => d.status === "done").length;
  const hasToday = days.some((d) => d.date === todayStr());

  return (
    <div className="rounded-2xl overflow-hidden khittah-week" style={{ background: C.panel, border: `1px solid ${hasToday ? C.gold : C.panelLighter}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 no-print"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={16}
            color={C.muted}
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 200ms ease" }}
          />
          <span className="text-sm font-bold" style={{ color: C.parchment }}>
            {weekLabel}
          </span>
        </div>
        <span className="text-xs" style={{ color: C.muted }}>
          {doneCount}/{days.length}
        </span>
      </button>
      <p className="hidden print-only text-sm font-bold px-4 pt-3" style={{ color: C.parchment }}>
        {weekLabel}
      </p>
      <div className="px-2.5 pb-2.5 space-y-1.5 khittah-week-body" style={{ display: open ? "block" : "none" }}>
        {days.map((day) => (
          <DayRow
            key={day.id}
            day={day}
            isToday={day.date === todayStr()}
            direction={direction}
            onSetStatus={onSetStatus}
            onNote={onNote}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Main App
----------------------------------------------------------------*/
export default function QuranKhittahApp() {
  const [plans, setPlans] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("home"); // "home" | "plans"
  const [showReport, setShowReport] = useState(false);
  const [followedCodes, setFollowedCodes] = useState([]);
  const [followedPlans, setFollowedPlans] = useState({}); // code -> plan
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followInput, setFollowInput] = useState("");
  const [followError, setFollowError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [viewingFollowedCode, setViewingFollowedCode] = useState(null);
  const [role, setRole] = useState(null); // null (unset) | "student" | "teacher"
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);
  const [teacherCodeInput, setTeacherCodeInput] = useState("");
  const [teacherLoginError, setTeacherLoginError] = useState("");

  useEffect(() => {
    (async () => {
      const [p, a, codes, savedRole] = await Promise.all([loadPlans(), loadActiveId(), loadFollowedCodes(), loadRole()]);
      setPlans(p);
      setActiveId(a && p.find((x) => x.id === a) ? a : p[0]?.id || null);
      setFollowedCodes(codes);
      setRole(savedRole);
      setLoading(false);
      const entries = await Promise.all(codes.map(async (c) => [c, await fetchSharedPlan(c)]));
      setFollowedPlans(Object.fromEntries(entries.filter(([, v]) => v)));
    })();
  }, []);

  const persist = useCallback(async (nextPlans, nextActive) => {
    setSaving(true);
    await savePlans(nextPlans);
    if (nextActive !== undefined) await saveActiveId(nextActive);
    setSaving(false);
  }, []);

  const activePlan = useMemo(() => plans.find((p) => p.id === activeId) || null, [plans, activeId]);

  const createPlan = (plan) => {
    const next = [...plans, plan];
    setPlans(next);
    setActiveId(plan.id);
    setShowCreate(false);
    persist(next, plan.id);
  };

  const deletePlan = (id) => {
    const next = plans.filter((p) => p.id !== id);
    setPlans(next);
    const nextActive = activeId === id ? next[0]?.id || null : activeId;
    setActiveId(nextActive);
    persist(next, nextActive);
  };

  const updateDay = (planId, dayId, patch) => {
    let updatedPlan = null;
    const next = plans.map((p) => {
      if (p.id !== planId) return p;
      updatedPlan = { ...p, schedule: p.schedule.map((d) => (d.id === dayId ? { ...d, ...patch } : d)) };
      return updatedPlan;
    });
    setPlans(next);
    persist(next);
    if (updatedPlan && updatedPlan.shareCode) pushSharedPlan(updatedPlan);
  };

  const planProgress = (p) => {
    const done = p.schedule.filter((d) => d.status === "done");
    const completedUnits = done.reduce((sum, d) => sum + d.amount, 0);
    return p.totalUnits > 0 ? Math.round((completedUnits / p.totalUnits) * 100) : 0;
  };

  // Student side: generate (if needed) a share code for the active plan and publish it.
  const shareActivePlan = async () => {
    if (!activePlan) return;
    let plan = activePlan;
    if (!plan.shareCode) {
      plan = { ...plan, shareCode: genShareCode() };
      const next = plans.map((p) => (p.id === plan.id ? plan : p));
      setPlans(next);
      persist(next);
    }
    await pushSharedPlan(plan);
    setShowShareModal(true);
  };

  // Teacher side: add a student's code to the followed list and fetch their plan.
  const addFollowedCode = async () => {
    const code = followInput.trim().toUpperCase();
    if (!code) return;
    setFollowError("");
    setFollowLoading(true);
    const plan = await fetchSharedPlan(code);
    setFollowLoading(false);
    if (!plan) {
      setFollowError("ما لقينا خطة بهذا الرمز — تأكد منه مع الطالب.");
      return;
    }
    if (!followedCodes.includes(code)) {
      const next = [...followedCodes, code];
      setFollowedCodes(next);
      saveFollowedCodes(next);
    }
    setFollowedPlans((prev) => ({ ...prev, [code]: plan }));
    setFollowInput("");
    setShowFollowModal(false);
  };

  const removeFollowedCode = (code) => {
    const next = followedCodes.filter((c) => c !== code);
    setFollowedCodes(next);
    saveFollowedCodes(next);
    setFollowedPlans((prev) => {
      const copy = { ...prev };
      delete copy[code];
      return copy;
    });
    if (viewingFollowedCode === code) setViewingFollowedCode(null);
  };

  const refreshFollowedPlan = async (code) => {
    const plan = await fetchSharedPlan(code);
    if (plan) setFollowedPlans((prev) => ({ ...prev, [code]: plan }));
  };

  const stats = useMemo(() => {
    if (!activePlan) return null;
    const s = activePlan.schedule;
    const done = s.filter((d) => d.status === "done");
    const missed = s.filter((d) => d.status === "missed");
    const completedUnits = done.reduce((sum, d) => sum + d.amount, 0);
    const pct = activePlan.totalUnits > 0 ? Math.round((completedUnits / activePlan.totalUnits) * 100) : 0;

    // streak: consecutive done days ending at most recent day with date <= today
    const sorted = [...s].sort((a, b) => (a.date < b.date ? 1 : -1));
    let streak = 0;
    for (const d of sorted) {
      if (d.date > todayStr()) continue;
      if (d.status === "done") streak++;
      else break;
    }

    const today = s.find((d) => d.date === todayStr());

    // weekly chunks of 7 schedule-days
    const weeks = [];
    for (let i = 0; i < s.length; i += 7) {
      const chunk = s.slice(i, i + 7);
      weeks.push({
        name: `أسبوع ${weeks.length + 1}`,
        منجز: chunk.filter((d) => d.status === "done").length,
        متبقي: chunk.filter((d) => d.status !== "done").length,
      });
    }

    return {
      total: s.length,
      doneCount: done.length,
      missedCount: missed.length,
      remaining: s.length - done.length - missed.length,
      completedUnits,
      pct,
      streak,
      today,
      weeks,
    };
  }, [activePlan]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.ink }}
      >
        <Loader2 className="animate-spin" color={C.gold} size={28} />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6" style={{ background: C.ink }} dir="rtl">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'); * { font-family: 'IBM Plex Sans Arabic', sans-serif; }`}</style>
        <Rub size={36} color={C.gold} />
        <h1 className="text-2xl mt-4 mb-1" style={{ color: C.parchment, fontFamily: "'Aref Ruqaa', serif" }}>
          خِطّة
        </h1>
        <p className="text-sm mb-8 text-center" style={{ color: C.muted }}>
          هل تدخل كطالب أو كمعلم؟
        </p>
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={async () => {
              setRole("student");
              saveRole("student");
            }}
            className="w-full text-right rounded-2xl p-4 flex items-center gap-3.5"
            style={{ background: C.panel, border: `1.5px solid ${C.panelLighter}` }}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: C.gold }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold" style={{ color: C.parchment }}>
                طالب
              </div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                أنشئ خططك وتابعها — بدون أي رمز
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              setTeacherLoginError("");
              setTeacherCodeInput("");
              setShowTeacherLogin(true);
            }}
            className="w-full text-right rounded-2xl p-4 flex items-center gap-3.5"
            style={{ background: C.panel, border: `1.5px solid ${C.panelLighter}` }}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: C.sage }}>
              <RotateCcw size={20} color="#fff" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold" style={{ color: C.parchment }}>
                معلم
              </div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                يحتاج رمز سري — تابع طلابك برمز المشاركة اللي يعطونك إياه
              </div>
            </div>
          </button>
        </div>

        {showTeacherLogin && (
          <div className="w-full max-w-sm mt-4 rounded-2xl p-5 khittah-fade" style={{ background: C.panel, border: `1.5px solid ${C.panelLighter}` }}>
            <label className="block text-sm mb-2" style={{ color: C.parchment }}>
              أدخل الرمز السري للمعلّمين
            </label>
            <input
              type="password"
              value={teacherCodeInput}
              onChange={(e) => setTeacherCodeInput(e.target.value)}
              placeholder="الرمز السري"
              className="w-full rounded-xl px-3.5 py-3 text-center text-sm outline-none mb-2"
              style={{ background: C.ink, color: C.parchment, border: `1.5px solid ${C.gold}` }}
            />
            {teacherLoginError && (
              <p className="text-xs mb-2" style={{ color: C.brick }}>
                {teacherLoginError}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowTeacherLogin(false)}
                className="rounded-xl px-4 py-2.5 text-sm"
                style={{ background: "transparent", color: C.parchmentDim, border: `1px solid ${C.panelLighter}` }}
              >
                رجوع
              </button>
              <button
                onClick={() => {
                  if (teacherCodeInput.trim() === TEACHER_ACCESS_CODE) {
                    setRole("teacher");
                    saveRole("teacher");
                    setShowTeacherLogin(false);
                    setFollowError("");
                    setFollowInput("");
                    setShowFollowModal(true);
                  } else {
                    setTeacherLoginError("الرمز غير صحيح.");
                  }
                }}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold"
                style={{ background: C.gold, color: "#fff" }}
              >
                دخول
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "طاب ليلك" : hour < 12 ? "صباح الخير" : hour < 17 ? "طاب يومك" : hour < 20 ? "طاب مساؤك" : "طاب ليلك";
  const todayLong = new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen w-full"
      style={{
        background: C.ink,
        backgroundImage: `radial-gradient(${C.panelLighter} 1px, transparent 1px)`,
        backgroundSize: "26px 26px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        * { font-family: 'IBM Plex Sans Arabic', sans-serif; }
        .khittah-scrollbar::-webkit-scrollbar { width: 6px; }
        .khittah-scrollbar::-webkit-scrollbar-thumb { background: ${C.panelLighter}; border-radius: 999px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8); }
        button, input, select { transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, opacity 180ms ease, transform 120ms ease; }
        button:active { transform: scale(0.97); }
        .khittah-fade { animation: khittahFade 320ms cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes khittahFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .khittah-view-fade { animation: khittahViewFade 280ms cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes khittahViewFade { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
        .print-only { display: none; }
        @page { size: portrait; margin: 12mm; }
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; width: 100% !important; height: auto !important; overflow: visible !important; }
          .khittah-report-row { break-inside: avoid; }
          table { page-break-inside: auto; }
          thead { display: table-header-group; }
        }
      `}</style>

      {/* Header */}
      <header
        className="px-5 py-4 flex items-center justify-between sticky top-0 z-30 no-print"
        style={{ background: `${C.ink}f2`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.panelLighter}` }}
      >
        <div className="flex items-center gap-2.5">
          <Rub size={22} color={C.gold} />
          <div>
            <h1
              className="text-lg leading-none"
              style={{ color: C.goldSoft, fontFamily: "'Aref Ruqaa', serif" }}
            >
              خِطّة
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>
              {greeting} — {todayLong}
              <span className="mx-1" style={{ opacity: 0.4 }}>
                •
              </span>
              <span style={{ color: C.goldDim }}>{BUILD_TAG}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-28">
        <div key={view} className="khittah-view-fade">
        {view === "plans" || role === "teacher" ? (
          <div className="pt-5">
            <h2 className="text-xl mb-4" style={{ color: C.parchment, fontFamily: "'Aref Ruqaa', serif" }}>
              خططي
            </h2>
            {plans.length === 0 ? (
              <p className="text-sm text-center py-16" style={{ color: C.muted }}>
                لا توجد خطط بعد. اضغط + بالأسفل لإنشاء أول خطة.
              </p>
            ) : (
              <div className="space-y-3">
                {plans.map((p) => {
                  const pct = planProgress(p);
                  const isActive = p.id === activeId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveId(p.id);
                        persist(plans, p.id);
                        setView("home");
                      }}
                      className="w-full text-right rounded-2xl p-4 flex items-center gap-3.5 transition"
                      style={{
                        background: isActive ? C.panelLight : C.panel,
                        border: `1px solid ${isActive ? C.gold : C.panelLighter}`,
                      }}
                    >
                      <div className="relative shrink-0" style={{ width: 44, height: 44 }}>
                        <svg width={44} height={44} className="-rotate-90">
                          <circle cx={22} cy={22} r={18} stroke={C.panelLighter} strokeWidth={4} fill="none" />
                          <circle
                            cx={22}
                            cy={22}
                            r={18}
                            stroke={C.gold}
                            strokeWidth={4}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 18}
                            strokeDashoffset={2 * Math.PI * 18 * (1 - Math.min(pct, 100) / 100)}
                          />
                        </svg>
                        <span
                          className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
                          style={{ color: C.goldSoft }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold truncate" style={{ color: isActive ? C.goldSoft : C.parchment }}>
                          {p.title}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                          {p.type} • {p.direction === "reverse" ? "من النهاية" : "من البداية"}
                        </div>
                      </div>
                      {isActive && (
                        <span className="text-[10px] px-2 py-1 rounded-full shrink-0" style={{ background: C.panelLighter, color: C.goldSoft }}>
                          نشطة
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Teacher: follow students */}
            <div className="flex items-center justify-between mt-8 mb-3">
              <h2 className="text-xl" style={{ color: C.parchment, fontFamily: "'Aref Ruqaa', serif" }}>
                متابعة الطلاب
              </h2>
              <button
                onClick={() => {
                  setFollowError("");
                  setFollowInput("");
                  setShowFollowModal(true);
                }}
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: C.gold, color: "#fff" }}
              >
                <Plus size={13} strokeWidth={3} /> إضافة طالب
              </button>
            </div>
            {followedCodes.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: C.muted }}>
                ما تتابع أي طالب بعد. اضغط "إضافة طالب" وأدخل رمز المشاركة اللي عطاك إياه.
              </p>
            ) : (
              <div className="space-y-3">
                {followedCodes.map((code) => {
                  const sp = followedPlans[code];
                  if (!sp) {
                    return (
                      <div key={code} className="rounded-2xl p-4 text-xs" style={{ background: C.panel, border: `1px solid ${C.panelLighter}`, color: C.muted }}>
                        تعذّر تحميل خطة الرمز {code}
                      </div>
                    );
                  }
                  const pct = sp.totalUnits > 0 ? Math.round((sp.schedule.filter((d) => d.status === "done").reduce((s, d) => s + d.amount, 0) / sp.totalUnits) * 100) : 0;
                  return (
                    <button
                      key={code}
                      onClick={async () => {
                        await refreshFollowedPlan(code);
                        setViewingFollowedCode(code);
                      }}
                      className="w-full text-right rounded-2xl p-4 flex items-center gap-3.5"
                      style={{ background: C.panel, border: `1px solid ${C.panelLighter}` }}
                    >
                      <div className="relative shrink-0" style={{ width: 44, height: 44 }}>
                        <svg width={44} height={44} className="-rotate-90">
                          <circle cx={22} cy={22} r={18} stroke={C.panelLighter} strokeWidth={4} fill="none" />
                          <circle
                            cx={22}
                            cy={22}
                            r={18}
                            stroke={C.sage}
                            strokeWidth={4}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 18}
                            strokeDashoffset={2 * Math.PI * 18 * (1 - Math.min(pct, 100) / 100)}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: C.goldSoft }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold truncate" style={{ color: C.parchment }}>
                          {sp.title}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                          {sp.type} • رمز {code}
                        </div>
                      </div>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFollowedCode(code);
                        }}
                        className="p-1.5 shrink-0"
                      >
                        <X size={15} color={C.brick} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 gap-4">
            <div className="relative flex items-center justify-center mb-1" style={{ width: 96, height: 96 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: `1.5px solid ${C.panelLighter}` }}
              />
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{ inset: 10, background: C.gold }}
              >
                <Rub size={30} color="#fff" />
              </div>
            </div>
            <h2 className="text-2xl" style={{ color: C.parchment, fontFamily: "'Aref Ruqaa', serif" }}>
              ابدأ خِطّتك الأولى
            </h2>
            <p className="text-sm max-w-xs leading-6" style={{ color: C.muted }}>
              حدّد هدفك — حفظ أو مراجعة — وسنبني لك جدولًا يوميًا مبنيًا على مصحف المدينة الحقيقي، صفحة بصفحة أو نصف صفحة.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold mt-2"
              style={{ background: C.gold, color: C.ink2 }}
            >
              <Plus size={16} strokeWidth={3} />
              إنشاء خطتي الأولى
            </button>
          </div>
        ) : (
          <>
            {activePlan && stats && (
              <>
                {/* Today card */}
                <section
                  className="mt-5 rounded-2xl p-6 flex items-center gap-5"
                  style={{ background: C.panel, border: `1px solid ${C.panelLighter}` }}
                >
                  <ProgressRing pct={stats.pct} size={104} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: C.panelLighter, color: C.goldSoft }}>
                        {activePlan.type}
                      </span>
                      <span className="text-[11px]" style={{ color: C.muted }}>
                        {activePlan.title}
                      </span>
                    </div>
                    {stats.today ? (
                      <>
                        {stats.today.majorReview && (
                          <div className="flex items-center gap-1.5 text-[11px] mb-1.5" style={{ color: C.goldSoft }}>
                            <Layers size={11} />
                            تثبيت (قبل الحفظ) — {trackLabel(activePlan.direction, stats.today.majorReview)}
                          </div>
                        )}
                        <h3 className="text-base font-semibold" style={{ color: C.parchment }}>
                          {stats.today.isReview && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1.5" style={{ background: C.sage, color: "#fff" }}>
                              مراجعة
                            </span>
                          )}
                          {activePlan.direction === "reverse"
                            ? (() => {
                                const wholeRange =
                                  (stats.today.fromAyah || 1) === 1 &&
                                  (stats.today.toAyah || SURAH_AYAH[stats.today.to]) === SURAH_AYAH[stats.today.to];
                                if (stats.today.from === stats.today.to) {
                                  return wholeRange
                                    ? `اليوم: سورة ${SURAH_NAMES[stats.today.from]}`
                                    : `اليوم: سورة ${SURAH_NAMES[stats.today.from]} — آية ${stats.today.fromAyah} إلى ${stats.today.toAyah}`;
                                }
                                return wholeRange
                                  ? `اليوم: من سورة ${SURAH_NAMES[stats.today.from]} إلى سورة ${SURAH_NAMES[stats.today.to]}`
                                  : `اليوم: من سورة ${SURAH_NAMES[stats.today.from]} إلى سورة ${SURAH_NAMES[stats.today.to]} (آية ${stats.today.toAyah})`;
                              })()
                            : `اليوم: ${halfPageMainLabel(stats.today.from, stats.today.to)}`}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                          {activePlan.direction === "reverse"
                            ? reverseRangeLabel(stats.today.from, stats.today.to, stats.today.fromAyah, stats.today.toAyah)
                            : `${halfPageRangeLabel(stats.today.from, stats.today.to)} • ${juzLabel(pageOfHp(stats.today.from), pageOfHp(stats.today.to))}`}
                        </p>
                        {stats.today.minorReview && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: C.sage }}>
                              <RotateCcw size={11} />
                              مراجعة صغرى — {trackLabel(activePlan.direction, stats.today.minorReview)}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3 no-print">
                          <button
                            onClick={() => updateDay(activePlan.id, stats.today.id, { status: "done" })}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
                            style={{ background: C.sage, color: C.ink2 }}
                          >
                            <Check size={13} strokeWidth={3} /> سمعت اليوم
                          </button>
                          <button
                            onClick={() => updateDay(activePlan.id, stats.today.id, { status: "missed" })}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                            style={{ background: "transparent", color: C.muted, border: `1px solid ${C.panelLighter}` }}
                          >
                            <X size={13} /> لم أنجز
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm" style={{ color: C.muted }}>
                        لا يوجد وِرد مجدوَل لليوم — إما إجازة أو خارج مدة الخطة.
                      </p>
                    )}
                  </div>
                </section>

                {/* Stats row */}
                <p className="text-[11px] font-bold tracking-wide mt-7 mb-2" style={{ color: C.goldSoft }}>
                  الإحصائيات
                </p>
                <section className="grid grid-cols-4 gap-2.5">
                  {[
                    {
                      icon: <BookOpen size={15} color={C.gold} />,
                      label: activePlan.direction === "reverse" ? "سور متبقية" : "صفحات متبقية",
                      value: activePlan.totalUnits - stats.completedUnits,
                    },
                    { icon: <TrendingUp size={15} color={C.gold} />, label: "أيام منجزة", value: stats.doneCount },
                    { icon: <Flame size={15} color={C.gold} />, label: "التتابع", value: stats.streak },
                    { icon: <Calendar size={15} color={C.gold} />, label: "أيام متبقية", value: stats.remaining },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-3.5 text-center" style={{ background: C.panel, border: `1px solid ${C.panelLighter}` }}>
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <div className="text-lg font-bold" style={{ color: C.parchment, fontFamily: "'Aref Ruqaa', serif" }}>
                        {s.value}
                      </div>
                      <div className="text-[10px]" style={{ color: C.muted }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Weekly chart */}
                {stats.weeks.length > 1 && (
                  <section className="mt-7 rounded-2xl p-4" style={{ background: C.panel, border: `1px solid ${C.panelLighter}` }}>
                    <h4 className="text-sm mb-2" style={{ color: C.parchmentDim }}>
                      التقدّم الأسبوعي
                    </h4>
                    <div style={{ width: "100%", height: 160 }}>
                      <ResponsiveContainer>
                        <BarChart data={stats.weeks}>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.panelLighter} vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={{ stroke: C.panelLighter }} tickLine={false} />
                          <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ background: C.ink2, border: `1px solid ${C.panelLighter}`, borderRadius: 8, fontSize: 12 }}
                            labelStyle={{ color: C.goldSoft }}
                          />
                          <Bar dataKey="منجز" stackId="a" fill={C.sage} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="متبقي" stackId="a" fill={C.panelLighter} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                )}

                <Divider />

                {/* Full schedule */}
                <section className="mt-3 space-y-2.5">
                  <div className="hidden print-only">
                    <PlanReportTable activePlan={activePlan} />
                  </div>
                  <div className="flex items-center justify-between mb-1 px-1 no-print flex-wrap gap-y-1.5">
                    <h4 className="text-[11px] font-bold tracking-wide" style={{ color: C.goldSoft }}>
                      جدول الخطة الكامل
                    </h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={shareActivePlan}
                        className="flex items-center gap-1 text-[11px]"
                        style={{ color: C.goldSoft }}
                      >
                        <Share2 size={12} /> {activePlan.shareCode ? "رمز المشاركة" : "مشاركة مع معلم"}
                      </button>
                      <button
                        onClick={() => setShowReport(true)}
                        className="flex items-center gap-1 text-[11px]"
                        style={{ color: C.goldSoft }}
                      >
                        <Eye size={12} /> معاينة
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1 text-[11px]"
                        style={{ color: C.goldSoft }}
                      >
                        <FileDown size={12} /> تحميل PDF
                      </button>
                      <button
                        onClick={() => deletePlan(activePlan.id)}
                        className="flex items-center gap-1 text-[11px]"
                        style={{ color: C.brick }}
                      >
                        <Trash2 size={12} /> حذف الخطة
                      </button>
                    </div>
                  </div>
                  <div className="no-print space-y-2.5">
                    {(() => {
                      const schedule = activePlan.schedule;
                      const weeks = [];
                      for (let i = 0; i < schedule.length; i += 7) weeks.push(schedule.slice(i, i + 7));
                      const todayWeekIdx = weeks.findIndex((w) => w.some((d) => d.date === todayStr()));
                      const firstPendingWeekIdx = weeks.findIndex((w) => w.some((d) => d.status === "pending"));
                      const openIdx = todayWeekIdx >= 0 ? todayWeekIdx : firstPendingWeekIdx >= 0 ? firstPendingWeekIdx : 0;
                      return weeks.map((weekDays, i) => (
                        <WeekGroup
                          key={`${activePlan.id}-week-${i}`}
                          weekLabel={`الأسبوع ${i + 1} — ${fmtDate(weekDays[0].date)}`}
                          days={weekDays}
                          direction={activePlan.direction}
                          defaultOpen={i === openIdx}
                          onSetStatus={(id, status) => updateDay(activePlan.id, id, { status })}
                          onNote={(id, note) => updateDay(activePlan.id, id, { note })}
                        />
                      ));
                    })()}
                  </div>
                </section>
              </>
            )}
          </>
        )}
        </div>
      </main>

      {showReport && activePlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto no-print khittah-view-fade" style={{ background: "#EAF2FB" }} dir="rtl">
          <div
            className="px-5 py-4 flex items-center justify-between sticky top-0 z-10"
            style={{ background: "#fff", borderBottom: "1px solid #CFDFEF" }}
          >
            <h2 className="text-lg font-bold" style={{ color: "#16283B" }}>
              معاينة التقرير
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold"
                style={{ background: "#2C6CA3", color: "#fff" }}
              >
                <FileDown size={14} /> تحميل PDF
              </button>
              <button onClick={() => setShowReport(false)} className="p-2 rounded-full hover:bg-black/5" aria-label="إغلاق">
                <X size={20} color="#54697E" />
              </button>
            </div>
          </div>
          <div className="max-w-2xl mx-auto p-4">
            <PlanReportTable activePlan={activePlan} />
          </div>
        </div>
      )}

      {showFollowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 no-print" style={{ background: "rgba(6,20,19,0.55)" }} dir="rtl">
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: C.panel, border: `1px solid ${C.panelLighter}` }}>
            <h3 className="text-base font-bold mb-1" style={{ color: C.parchment }}>
              إضافة طالب
            </h3>
            <p className="text-xs mb-4" style={{ color: C.muted }}>
              أدخل رمز المشاركة اللي عطاك إياه الطالب.
            </p>
            <input
              value={followInput}
              onChange={(e) => setFollowInput(e.target.value.toUpperCase())}
              placeholder="مثال: K7X2QF"
              className="w-full rounded-xl px-3.5 py-3 text-center text-lg font-bold tracking-[0.2em] outline-none mb-2"
              style={{ background: C.ink, color: C.parchment, border: `1.5px solid ${C.gold}` }}
            />
            {followError && (
              <p className="text-xs mb-2" style={{ color: C.brick }}>
                {followError}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowFollowModal(false)}
                className="rounded-xl px-4 py-2.5 text-sm"
                style={{ background: "transparent", color: C.parchmentDim, border: `1px solid ${C.panelLighter}` }}
              >
                إلغاء
              </button>
              <button
                disabled={!followInput.trim() || followLoading}
                onClick={addFollowedCode}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold disabled:opacity-40"
                style={{ background: C.gold, color: "#fff" }}
              >
                {followLoading ? "جارِ البحث..." : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingFollowedCode && followedPlans[viewingFollowedCode] && (
        <div className="fixed inset-0 z-50 overflow-y-auto no-print khittah-view-fade" style={{ background: C.ink }} dir="rtl">
          <div
            className="px-5 py-4 flex items-center justify-between sticky top-0 z-10"
            style={{ background: `${C.ink}f2`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.panelLighter}` }}
          >
            <div>
              <h2 className="text-lg font-bold" style={{ color: C.parchment }}>
                {followedPlans[viewingFollowedCode].title}
              </h2>
              <p className="text-[11px]" style={{ color: C.muted }}>
                عرض فقط — رمز {viewingFollowedCode}
              </p>
            </div>
            <button onClick={() => setViewingFollowedCode(null)} className="p-2 rounded-full hover:bg-white/5" aria-label="إغلاق">
              <X size={20} color={C.muted} />
            </button>
          </div>
          <div className="max-w-2xl mx-auto p-4">
            <PlanReportTable activePlan={followedPlans[viewingFollowedCode]} />
          </div>
        </div>
      )}

      {showShareModal && activePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 no-print" style={{ background: "rgba(6,20,19,0.55)" }} dir="rtl">
          <div className="w-full max-w-sm rounded-2xl p-6 text-center" style={{ background: C.panel, border: `1px solid ${C.panelLighter}` }}>
            <Share2 size={28} color={C.gold} className="mx-auto mb-3" />
            <h3 className="text-base font-bold mb-1" style={{ color: C.parchment }}>
              رمز مشاركة الخطة
            </h3>
            <p className="text-xs mb-4" style={{ color: C.muted }}>
              أعط هذا الرمز لمعلّمك ليتابع خطتك مباشرة. يتحدّث تلقائيًا كل ما تحدّث تقدّمك.
            </p>
            <div
              className="text-3xl font-bold tracking-[0.3em] rounded-xl py-4 mb-4"
              style={{ background: C.panelLight, color: C.goldSoft, letterSpacing: "0.3em" }}
            >
              {activePlan.shareCode}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(activePlan.shareCode);
                  } catch {}
                }}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold"
                style={{ background: C.gold, color: "#fff" }}
              >
                نسخ الرمز
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 rounded-xl py-2.5 text-sm"
                style={{ background: "transparent", color: C.parchmentDim, border: `1px solid ${C.panelLighter}` }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 inset-x-0 z-30 no-print"
        style={{ background: `${C.ink}f5`, backdropFilter: "blur(10px)", borderTop: `1px solid ${C.panelLighter}` }}
      >
        <div className="max-w-2xl mx-auto px-8 py-2 flex items-center justify-between">
          <button
            onClick={() => setView("home")}
            className="flex flex-col items-center gap-1 px-4 py-1.5"
            style={{ color: view === "home" ? C.gold : C.muted }}
          >
            <Home size={20} />
            <span className="text-[10px] font-bold">الصفحة الرئيسية</span>
          </button>
          <button
            onClick={() => {
              if (role === "teacher") {
                setFollowError("");
                setFollowInput("");
                setShowFollowModal(true);
              } else {
                setShowCreate(true);
              }
            }}
            className="w-14 h-14 rounded-full flex items-center justify-center -mt-6"
            style={{ background: C.gold, boxShadow: `0 4px 14px ${SHADOW}` }}
            aria-label={role === "teacher" ? "إضافة طالب" : "خطة جديدة"}
          >
            <Plus size={24} color={C.ink2} strokeWidth={3} />
          </button>
          <button
            onClick={() => setView("plans")}
            className="flex flex-col items-center gap-1 px-4 py-1.5"
            style={{ color: view === "plans" ? C.gold : C.muted }}
          >
            <BookOpen size={20} />
            <span className="text-[10px] font-bold">خططي</span>
          </button>
        </div>
      </nav>

      {saving && (
        <div
          className="fixed bottom-24 left-4 flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full no-print"
          style={{ background: C.panel, color: C.muted, border: `1px solid ${C.panelLighter}` }}
        >
          <Loader2 size={11} className="animate-spin" /> جارِ الحفظ
        </div>
      )}

      {showCreate && <CreatePlanModal onClose={() => setShowCreate(false)} onCreate={createPlan} />}
    </div>
  );
}
