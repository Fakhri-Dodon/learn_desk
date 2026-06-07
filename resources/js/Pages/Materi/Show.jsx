import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
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
import { faCheckCircle, faUserGroup, faEye, faShare2, faTasks, faBarChart } from "@fortawesome/free-solid-svg-icons";

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

export default function Show({ materi }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const embedUrl = getVideoEmbedUrl(materi.link);

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
    const isStudent = user?.role === 'student';

    // Mock data for teacher view
    const teacherStats = {
        totalStudents: 32,
        completionProgress: 74,
        studentUnderstanding: 'High',
        avgTimeSpent: '18m 42s',
        quizPassRate: 92,
        views: 1240,
    };

    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />

            <div className="mx-auto max-w-7xl">
                {/* Main Content Two-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column (70%) - Video and Content */}
                    <div className="flex-1 space-y-6">
                        {/* Video Player */}
                        <VideoPlayer videoUrl={embedUrl} title={materi.title} />

                        {/* Tags and Title Section */}
                        <div className="space-y-3">
                            <div className="flex gap-2 flex-wrap">
                                <Badge label="Biology" variant="primary" />
                                <Badge label="Grade 11" variant="gray" />
                                <Badge label="Interactive" variant="warning" />
                            </div>

                            <Typography variant="h2" className="!text-3xl">
                                {materi.title}
                            </Typography>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <RichTextDisplay content={materi.description} />

                            {/* Key Learning Objectives */}
                            <div>
                                <Typography variant="h4" className="mb-3">
                                    Key Learning Objectives:
                                </Typography>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Diagram the stages of aerobic vs. anaerobic respiration.</li>
                                    <li>Calculate net ATP gain from a single glucose molecule.</li>
                                    <li>Identify common metabolic inhibitors and their physiological effects.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (30%) - Teacher Actions & Statistics */}
                    <div className="w-full lg:w-[30%] space-y-6">

                        {/* Teacher Actions Card */}
                        <Card>
                            <div className="flex items-center gap-2 mb-6">
                                <FontAwesomeIcon icon={faTasks} className="w-5 h-5 text-indigo-600" />
                                <Typography variant="h4">
                                    Teacher Actions
                                </Typography>
                            </div>

                            <div className="space-y-3">
                                <PrimaryButton variant="indigo" className="w-full justify-center gap-2">
                                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                                    Give Assignment
                                </PrimaryButton>

                                <SecondaryButton className="w-full justify-center gap-2">
                                    <FontAwesomeIcon icon={faTasks} className="w-4 h-4" />
                                    Edit Material
                                </SecondaryButton>

                                <div className="flex gap-2 pt-2 border-t border-gray-200">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                                        <span className="text-xs">1,240 Views</span>
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                                        <FontAwesomeIcon icon={faShare2} className="w-4 h-4" />
                                        <span className="text-xs">Share</span>
                                    </button>
                                </div>
                            </div>
                        </Card>

                        {/* Class Statistics Card */}
                        <Card highlight={true}>
                            <div className="flex items-center gap-2 mb-6">
                                <FontAwesomeIcon icon={faBarChart} className="w-5 h-5 text-indigo-600" />
                                <Typography variant="h4">
                                    Class Statistics
                                </Typography>
                            </div>

                            <div className="space-y-6">
                                {/* Completion Progress */}
                                <ProgressBar
                                    value={teacherStats.completionProgress}
                                    label="Completion Progress"
                                    variant="primary"
                                />

                                {/* Students Stats */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-indigo-200">
                                    <StatBox
                                        label="Students"
                                        value={teacherStats.totalStudents}
                                        color="indigo"
                                    />
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Understanding</p>
                                        <p className="text-xl font-bold text-green-600">
                                            {teacherStats.studentUnderstanding}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Metrics */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600">Avg. Time Spent</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {teacherStats.avgTimeSpent}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600">Quiz Pass Rate</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {teacherStats.quizPassRate}%
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Insight */}
                                <div className="bg-white rounded-lg p-4 mt-6 border border-indigo-200">
                                    <Typography variant="h4" className="text-indigo-600 mb-2">
                                        Quick Insight
                                    </Typography>
                                    <p className="text-sm text-gray-700">
                                        Students who spent more than 15 minutes on Section 2 scored 30% higher on the final metabolic quiz.
                                    </p>
                                    <Link href="#" className="text-indigo-600 text-sm font-semibold mt-3 inline-block hover:underline">
                                        VIEW FULL REPORT →
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
