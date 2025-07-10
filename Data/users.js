const users = [
  {
    name: "Saksham Jaiswal",
    email: "cse24083@iiitkalyani.ac.in",
    role: "Student",
    department: "CSE",
    joined: "24 Feb, 2025",
    lastActive: "1d ago"
  },
  {
    name: "Aditi Roy",
    email: "aditi.roy@iiitkalyani.ac.in",
    role: "Faculty",
    department: "ECE",
    joined: "15 Jan, 2024",
    lastActive: "2h ago"
  },
  {
    name: "Karan Mehta",
    email: "karan.admin@campfeed.com",
    role: "Admin",
    department: "CSE",
    joined: "01 Nov, 2023",
    lastActive: "Just now"
  },
  {
    name: "Mehak Sharma",
    email: "mehak@clubs.iiitkalyani.ac.in",
    role: "Student Club",
    department: "AI/ML",
    joined: "10 Mar, 2024",
    lastActive: "3d ago"
  },
  {
    name: "Rahul Gupta",
    email: "rahul.gupta@iiitkalyani.ac.in",
    role: "Student",
    department: "Cybersecurity",
    joined: "22 Feb, 2025",
    lastActive: "1h ago"
  },
  {
    name: "Dr. Nidhi Verma",
    email: "nidhi.verma@iiitkalyani.ac.in",
    role: "Faculty",
    department: "AI/ML",
    joined: "05 Aug, 2022",
    lastActive: "4d ago"
  },
  {
    name: "Tanay Sinha",
    email: "tanay.sinha@admin.campfeed.com",
    role: "Admin",
    department: "Cybersecurity",
    joined: "12 Sep, 2023",
    lastActive: "10m ago"
  },
  {
    name: "Sneha Dutta",
    email: "sneha.club@iiitkalyani.ac.in",
    role: "Student Club",
    department: "CSE",
    joined: "03 May, 2024",
    lastActive: "6d ago"
  },
  {
    name: "Aniket Roy",
    email: "aniket.roy@iiitkalyani.ac.in",
    role: "Student",
    department: "ECE",
    joined: "12 Jan, 2025",
    lastActive: "20m ago"
  },
  {
    name: "Riya Singh",
    email: "riya.singh@faculty.iiitkalyani.ac.in",
    role: "Faculty",
    department: "CSE",
    joined: "08 Apr, 2023",
    lastActive: "5h ago"
  },
  {
    name: "Deepak Sen",
    email: "deepak.admin@campfeed.com",
    role: "Admin",
    department: "CSE",
    joined: "20 Jun, 2023",
    lastActive: "1d ago"
  },
  {
    name: "Neha Kumari",
    email: "neha@clubs.iiitkalyani.ac.in",
    role: "Student Club",
    department: "ECE",
    joined: "30 Oct, 2024",
    lastActive: "3h ago"
  },
  {
    name: "Raghav Sinha",
    email: "raghav.student@iiitkalyani.ac.in",
    role: "Student",
    department: "AI/ML",
    joined: "10 Mar, 2025",
    lastActive: "2d ago"
  },
  {
    name: "Ishita Mondal",
    email: "ishita.mondal@iiitkalyani.ac.in",
    role: "Faculty",
    department: "Cybersecurity",
    joined: "02 Dec, 2022",
    lastActive: "1w ago"
  },
  {
    name: "Yash Kapoor",
    email: "yash.kapoor@student.iiitkalyani.ac.in",
    role: "Student",
    department: "CSE",
    joined: "11 Feb, 2025",
    lastActive: "Just now"
  },
  {
    name: "Anjali Sharma",
    email: "anjali.club@iiitkalyani.ac.in",
    role: "Student Club",
    department: "AI/ML",
    joined: "28 Feb, 2024",
    lastActive: "7d ago"
  },
  {
    name: "Dr. Arvind Das",
    email: "arvind.das@iiitkalyani.ac.in",
    role: "Faculty",
    department: "CSE",
    joined: "14 Mar, 2022",
    lastActive: "3d ago"
  },
  {
    name: "Simran Kaur",
    email: "simran.kaur@iiitkalyani.ac.in",
    role: "Student",
    department: "ECE",
    joined: "17 Jan, 2025",
    lastActive: "6h ago"
  },
  {
    name: "Harsh Mishra",
    email: "harsh.admin@campfeed.com",
    role: "Admin",
    department: "AI/ML",
    joined: "01 Jul, 2023",
    lastActive: "2h ago"
  },
  {
    name: "Pranav Rao",
    email: "pranav.rao@iiitkalyani.ac.in",
    role: "Student",
    department: "Cybersecurity",
    joined: "19 Feb, 2025",
    lastActive: "8m ago"
  },
  { 'name': 'Ernest Nguyen', 'email': 'ernest.nguyen@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'CSE', 'joined': '02 Apr, 2024', 'lastActive': '6d ago' }, { 'name': 'Robin Beck', 'email': 'robin.beck@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'AI/ML', 'joined': '09 Apr, 2024', 'lastActive': '3d ago' }, { 'name': 'Donald Holmes', 'email': 'donald.holmes@admin.campfeed.com', 'role': 'Admin', 'department': 'ECE', 'joined': '26 Aug, 2023', 'lastActive': '3d ago' }, { 'name': 'Gerald Contreras', 'email': 'gerald.contreras@admin.campfeed.com', 'role': 'Admin', 'department': 'CSE', 'joined': '08 Oct, 2023', 'lastActive': '5d ago' }, { 'name': 'Calvin Martinez', 'email': 'calvin.martinez@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'ECE', 'joined': '21 Mar, 2025', 'lastActive': '55m ago' }, { 'name': 'Samantha Cox', 'email': 'samantha.cox@iiitkalyani.ac.in', 'role': 'Student', 'department': 'Cybersecurity', 'joined': '19 Jan, 2024', 'lastActive': '1w ago' }, { 'name': 'Allison Brock', 'email': 'allison.brock@iiitkalyani.ac.in', 'role': 'Student', 'department': 'ECE', 'joined': '19 Sep, 2024', 'lastActive': '4d ago' }, { 'name': 'Jennifer Patterson', 'email': 'jennifer.patterson@admin.campfeed.com', 'role': 'Admin', 'department': 'Cybersecurity', 'joined': '19 Apr, 2024', 'lastActive': '1w ago' }, { 'name': 'Terri Barrett', 'email': 'terri.barrett@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'ECE', 'joined': '30 Apr, 2024', 'lastActive': '1w ago' }, { 'name': 'Cheryl Hodges', 'email': 'cheryl.hodges@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '13 Jan, 2024', 'lastActive': '1w ago' }, { 'name': 'Mr. Barry Hodge MD', 'email': 'mr..barry.hodge.md@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '16 Dec, 2023', 'lastActive': '1d ago' }, { 'name': 'Jason Brown', 'email': 'jason.brown@admin.campfeed.com', 'role': 'Admin', 'department': 'Cybersecurity', 'joined': '09 Aug, 2024', 'lastActive': '1w ago' }, { 'name': 'Donna Ford', 'email': 'donna.ford@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '16 Jan, 2025', 'lastActive': '1w ago' }, { 'name': 'Judith Miller', 'email': 'judith.miller@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'ECE', 'joined': '21 Oct, 2024', 'lastActive': '6d ago' }, { 'name': 'Robin Thompson', 'email': 'robin.thompson@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '14 Jul, 2024', 'lastActive': '1w ago' }, { 'name': 'Misty Hobbs', 'email': 'misty.hobbs@admin.campfeed.com', 'role': 'Admin', 'department': 'ECE', 'joined': '01 Apr, 2025', 'lastActive': '6d ago' }, { 'name': 'Julia Sanchez', 'email': 'julia.sanchez@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'ECE', 'joined': '07 Aug, 2024', 'lastActive': '17h ago' }, { 'name': 'Christine Robertson', 'email': 'christine.robertson@admin.campfeed.com', 'role': 'Admin', 'department': 'CSE', 'joined': '12 May, 2025', 'lastActive': '1w ago' }, { 'name': 'Tricia Kramer', 'email': 'tricia.kramer@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'CSE', 'joined': '17 Apr, 2025', 'lastActive': '12h ago' }, { 'name': 'Teresa Hall', 'email': 'teresa.hall@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'AI/ML', 'joined': '19 Apr, 2025', 'lastActive': '1w ago' }, { 'name': 'Christopher Santiago', 'email': 'christopher.santiago@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'Cybersecurity', 'joined': '09 Aug, 2023', 'lastActive': '1w ago' }, { 'name': 'Dr. Randy Todd', 'email': 'dr..randy.todd@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'AI/ML', 'joined': '16 Sep, 2024', 'lastActive': '6h ago' }, { 'name': 'Gail Ellis', 'email': 'gail.ellis@iiitkalyani.ac.in', 'role': 'Student', 'department': 'AI/ML', 'joined': '01 Dec, 2024', 'lastActive': '11h ago' }, { 'name': 'Patrick Williams', 'email': 'patrick.williams@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'AI/ML', 'joined': '12 Dec, 2024', 'lastActive': '4d ago' }, { 'name': 'Derek Moreno', 'email': 'derek.moreno@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'Cybersecurity', 'joined': '05 Nov, 2024', 'lastActive': '5d ago' }, { 'name': 'Ashley Deleon', 'email': 'ashley.deleon@admin.campfeed.com', 'role': 'Admin', 'department': 'CSE', 'joined': '10 Sep, 2024', 'lastActive': '4d ago' }, { 'name': 'Shawn Trevino', 'email': 'shawn.trevino@iiitkalyani.ac.in', 'role': 'Student', 'department': 'Cybersecurity', 'joined': '28 Mar, 2024', 'lastActive': '6d ago' }, { 'name': 'William Parker', 'email': 'william.parker@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'AI/ML', 'joined': '13 May, 2025', 'lastActive': '1w ago' }, { 'name': 'Samantha Rodriguez', 'email': 'samantha.rodriguez@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'Cybersecurity', 'joined': '19 Jun, 2025', 'lastActive': '1w ago' }, { 'name': 'Joseph Hunter', 'email': 'joseph.hunter@iiitkalyani.ac.in', 'role': 'Student', 'department': 'Cybersecurity', 'joined': '21 Mar, 2025', 'lastActive': '1w ago' }, { 'name': 'Catherine Rodriguez', 'email': 'catherine.rodriguez@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '11 Apr, 2025', 'lastActive': '2d ago' }, { 'name': 'Keith Molina', 'email': 'keith.molina@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'Cybersecurity', 'joined': '20 Mar, 2025', 'lastActive': '1w ago' }, { 'name': 'John Davis', 'email': 'john.davis@admin.campfeed.com', 'role': 'Admin', 'department': 'ECE', 'joined': '28 Aug, 2024', 'lastActive': '1d ago' }, { 'name': 'Adam Gardner', 'email': 'adam.gardner@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '13 Jul, 2024', 'lastActive': '1w ago' }, { 'name': 'Mackenzie Graham', 'email': 'mackenzie.graham@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'CSE', 'joined': '01 Dec, 2023', 'lastActive': '1d ago' }, { 'name': 'Jennifer Fischer', 'email': 'jennifer.fischer@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'ECE', 'joined': '10 Apr, 2025', 'lastActive': '1w ago' }, { 'name': 'Latoya Spencer', 'email': 'latoya.spencer@iiitkalyani.ac.in', 'role': 'Student', 'department': 'ECE', 'joined': '13 Nov, 2024', 'lastActive': '3d ago' }, { 'name': 'Rachel Kennedy', 'email': 'rachel.kennedy@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'CSE', 'joined': '08 Feb, 2025', 'lastActive': '1w ago' }, { 'name': 'Donna Price', 'email': 'donna.price@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'CSE', 'joined': '17 Sep, 2023', 'lastActive': '5d ago' }, { 'name': 'Katelyn Moore', 'email': 'katelyn.moore@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'AI/ML', 'joined': '22 Nov, 2023', 'lastActive': '4d ago' }, { 'name': 'Steve Jones', 'email': 'steve.jones@iiitkalyani.ac.in', 'role': 'Student', 'department': 'ECE', 'joined': '13 Oct, 2023', 'lastActive': '2d ago' }, { 'name': 'Jesse Mayer', 'email': 'jesse.mayer@admin.campfeed.com', 'role': 'Admin', 'department': 'AI/ML', 'joined': '11 Sep, 2023', 'lastActive': '1w ago' }, { 'name': 'Joshua Brock', 'email': 'joshua.brock@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'ECE', 'joined': '01 Jan, 2024', 'lastActive': '3d ago' }, { 'name': 'Ms. Elizabeth Collins', 'email': 'ms..elizabeth.collins@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'ECE', 'joined': '26 Feb, 2024', 'lastActive': '7h ago' }, { 'name': 'Michael Ellis', 'email': 'michael.ellis@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'CSE', 'joined': '20 May, 2024', 'lastActive': '1w ago' }, { 'name': 'Aimee Ryan', 'email': 'aimee.ryan@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'ECE', 'joined': '26 Nov, 2024', 'lastActive': '1w ago' }, { 'name': 'William Hall', 'email': 'william.hall@admin.campfeed.com', 'role': 'Admin', 'department': 'ECE', 'joined': '24 May, 2024', 'lastActive': '1d ago' }, { 'name': 'Alison Nelson', 'email': 'alison.nelson@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'Cybersecurity', 'joined': '27 Dec, 2024', 'lastActive': '2d ago' }, { 'name': 'Jeremiah Lam MD', 'email': 'jeremiah.lam.md@iiitkalyani.ac.in', 'role': 'Student Club', 'department': 'Cybersecurity', 'joined': '11 Jan, 2025', 'lastActive': '1w ago' }, { 'name': 'Patrick Meza', 'email': 'patrick.meza@iiitkalyani.ac.in', 'role': 'Faculty', 'department': 'CSE', 'joined': '31 Jan, 2024', 'lastActive': '10h ago' },
];

export default users;