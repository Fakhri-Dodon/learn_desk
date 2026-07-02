import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import VideoPlayer from "@/Components/VideoPlayer";
import Typography from "@/Components/Typography";
import RichTextDisplay from "@/Components/RichTextDisplay";
import Card from "@/Components/Card";
import Badge from "@/Components/Badge";
import ProgressBar from "@/Components/ProgressBar";
import StatBox from "@/Components/StatBox";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faEye,
    faShareNodes,
    faTasks,
    faBarChart,
    faChevronRight,
    faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

const getVideoEmbedUrl = (url) => {
    if (!url) return null;

    const ytRegExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
        return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }

    const gdriveRegExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const gdriveMatch = url.match(gdriveRegExp);
    if (gdriveMatch && gdriveMatch[1]) {
        return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
    }

    return url;
};

export default function Show({ materi = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Proteksi ekstraksi data dari Laravel/Inertia data wrapper
    const dataMateri = materi?.data ? materi.data : materi;
    const pageProps = usePage().props;

    const embedUrl = getVideoEmbedUrl(dataMateri?.link);

    const isTeacher = user?.role === "teacher" || user?.role === "admin";
    const isStudent = user?.role === "student";

    // Mock data untuk tampilan statistik pengajar
    const teacherStats = {
        totalStudents: 32,
        completionProgress: 74,
        studentUnderstanding: "High",
        avgTimeSpent: "18m 42s",
        quizPassRate: 92,
        views: "1,240",
    };

    const badgeVariants = {
        10: "blue",
        11: "yellow",
        12: "pink",
    };

    const currentVariant = badgeVariants[materi?.class] || "gray";

    // Data assignment khusus untuk materi ini (KODEMU SUDAH BENAR)
    const assignmentsData = (pageProps.assigments || []).filter(
        (item) => item.materi_id === dataMateri.id,
    );

    console.log(
        "Assignments Data for Materi ID",
        dataMateri.id,
        ":",
        assignmentsData,
    );

    // --- KALKULASI PROGRESS UNTUK MATERI INI SAJA ---
    let totalDiberiTugas = assignmentsData.length;
    let totalSudahMengumpulkan = 0;
    let persentaseProgress = 0;

    if (totalDiberiTugas > 0) {
        totalSudahMengumpulkan = assignmentsData.filter(
            // Catatan: pastikan statusnya benar "sudah mengumpulkan" ya!
            (item) => item.status === "sudah mengumpulkan",
        ).length;

        persentaseProgress = Math.round(
            (totalSudahMengumpulkan / totalDiberiTugas) * 100,
        );
    }

    // === Fungsi Share Link Materi ===
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: "Check this out!",
            text: "Lihat profil atau halaman ini!",
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log(
                    "User membatalkan share atau terjadi error:",
                    error,
                );
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);

                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);
            } catch (error) {
                console.error("Gagal menyalin link:", error);
                alert("Gagal menyalin link ke clipboard.");
            }
        }
    };
    // === ===

    return (
        <AuthenticatedLayout>
            <Head title={dataMateri?.title || "Detail Materi"} />

            <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 animate-fade-in">
                {/* Main Content Two-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column (70%) - Video and Content Card */}
                    <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 sm:p-6 space-y-6">
                        {/* Video Player Container */}
                        <div className="rounded-xl overflow-hidden shadow-inner bg-gray-900">
                            <VideoPlayer
                                videoUrl={embedUrl}
                                title={dataMateri?.title}
                            />
                        </div>

                        {/* Tags and Title Section */}
                        <div className="space-y-3">
                            <div className="flex gap-2 flex-wrap">
                                <Badge
                                    label={`Class ${materi?.class}`}
                                    variant={
                                        materi?.class == 10
                                            ? "blue"
                                            : materi?.class == 11
                                              ? "yellow"
                                              : materi?.class == 12
                                                ? "pink"
                                                : "gray"
                                    }
                                />
                            </div>

                            <Typography
                                variant="h2"
                                className="!text-2xl sm:!text-3xl font-extrabold tracking-tight text-gray-900"
                            >
                                {dataMateri?.title || "Judul Materi"}
                            </Typography>
                        </div>

                        {/* <hr className="border-gray-100 w-3" /> */}

                        {/* Description & Learning Objectives */}
                        <div className="space-y-6 prose max-w-none text-gray-700">
                            {/* <RichTextDisplay content={dataMateri?.description || "<p>Tidak ada deskripsi.</p>"} /> */}

                            {/* Key Learning Objectives Section */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <FontAwesomeIcon
                                        icon={faGraduationCap}
                                        className="w-5 h-5 text-indigo-600"
                                    />
                                    <Typography
                                        variant="h4"
                                        className="font-bold text-gray-900"
                                    >
                                        Description
                                    </Typography>
                                </div>
                                <RichTextDisplay
                                    content={
                                        dataMateri?.description ||
                                        "<p>Tidak ada deskripsi.</p>"
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column (30%) - Actions & Statistics Panel */}
                    {isTeacher && (
                        <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 space-y-6">
                            {/* Teacher Actions Card */}
                            <Card className="shadow-sm border border-gray-100 rounded-2xl p-5">
                                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                                    <FontAwesomeIcon
                                        icon={faTasks}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <Typography
                                        variant="h4"
                                        className="font-bold text-gray-900"
                                    >
                                        Teacher Actions
                                    </Typography>
                                </div>

                                <div className="space-y-3">
                                    <PrimaryButton
                                        onClick={() =>
                                            router.get(
                                                `/assignment/${materi.id}`,
                                            )
                                        }
                                        variant="indigo"
                                        className="w-full justify-center gap-2 py-2.5 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="w-4 h-4"
                                        />
                                        Give Assignment
                                    </PrimaryButton>

                                    {/* <SecondaryButton className="w-full justify-center gap-2 py-2.5 transition transform hover:-translate-y-0.5 active:translate-y-0">
                                        <FontAwesomeIcon
                                            icon={faTasks}
                                            className="w-4 h-4"
                                        />
                                        Edit Material
                                    </SecondaryButton> */}

                                    <div className="flex justify-center pt-4 mt-4 border-t border-gray-100">
                                        <button
                                            onClick={handleShare}
                                            className={`flex items-center justify-center w-full max-w-xs gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                isCopied
                                                    ? "text-green-700 bg-green-50 border border-green-200"
                                                    : "text-gray-600 bg-gray-50 border border-transparent hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100"
                                            }`}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    isCopied
                                                        ? faCheck
                                                        : faShareNodes
                                                }
                                                className={`w-4 h-4 ${isCopied ? "text-green-600" : ""}`}
                                            />
                                            <span>
                                                {isCopied
                                                    ? "Link disalin!"
                                                    : "Share Materi"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            {/* Class Statistics Card */}
                            <Card
                                highlight={true}
                                className="rounded-2xl shadow-sm p-5"
                            >
                                <div className="flex items-center gap-2.5 mb-5">
                                    <FontAwesomeIcon
                                        icon={faBarChart}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <Typography
                                        variant="h4"
                                        className="font-bold text-gray-900"
                                    >
                                        Materi Statistics
                                    </Typography>
                                </div>

                                <div className="space-y-5">
                                    {/* Completion Progress */}
                                    <div className="bg-white/60 p-3 rounded-xl border border-indigo-50">
                                        <ProgressBar
                                            value={`${totalSudahMengumpulkan}/${totalDiberiTugas}`}
                                            label="Completion Progress"
                                            variant="primary"
                                            progress={persentaseProgress}
                                        />
                                    </div>

                                    {/* Students Stats */}
                                    {/* <div className="grid grid-cols-2 gap-4 py-3 border-y border-indigo-100">
                                        <StatBox
                                            label="Students"
                                            value={teacherStats.totalStudents}
                                            color="indigo"
                                        />
                                        <div className="pl-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Understanding
                                            </p>
                                            <p className="text-bottom text-xl font-extrabold text-green-600">
                                                {
                                                    teacherStats.studentUnderstanding
                                                }
                                            </p>
                                        </div>
                                    </div> */}

                                    {/* Additional Metrics */}
                                    {/* <div className="space-y-2.5 text-sm bg-white/40 p-3 rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-600 text-xs">Avg. Time Spent</p>
                                            <p className="font-semibold text-gray-900 text-xs">
                                                {teacherStats.avgTimeSpent}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-600 text-xs">Quiz Pass Rate</p>
                                            <p className="font-semibold text-indigo-600 text-xs bg-indigo-5 px-2 py-0.5 rounded-full">
                                                {teacherStats.quizPassRate}%
                                            </p>
                                        </div>
                                    </div> */}

                                    {/* Quick Insight Panel */}
                                    {/* <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm space-y-2">
                                        <Typography variant="h4" className="text-indigo-600 !text-sm font-bold tracking-tight">
                                            Quick Insight
                                        </Typography>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            Students who spent more than 15 minutes on Section 2 scored 30% higher on the final metabolic quiz.
                                        </p>
                                        <Link href="#" className="inline-flex items-center gap-1 text-indigo-600 text-xs font-bold pt-1 hover:text-indigo-700 transition-colors group">
                                            <span>VIEW FULL REPORT</span>
                                            <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </div> */}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
