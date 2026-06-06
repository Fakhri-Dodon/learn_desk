import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import VideoPlayer from "@/Components/VideoPlayer";
import Typography from "@/Components/Typography";
import RichTextDisplay from "@/Components/RichTextDisplay";
import ActionCard from "@/Components/ActionCard";
import PrimaryButton from "@/Components/PrimaryButton";

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

    const buttonLabel = isTeacher ? 'Edit Penugasan' : 'Kerjakan Tugas';
    const buttonHref = isTeacher ? `/assignment/${materi.id}` : `/student/assignment/${materi.id}`;

    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column (70%) - Main Content */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            <VideoPlayer videoUrl={embedUrl} title={materi.title} />

                            <div className="mt-4">
                                <Typography variant="h1">
                                    {materi.title}
                                </Typography>

                                <div className="mt-4">
                                    <RichTextDisplay content={materi.description} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (30%) - Actions */}
                    <div className="w-full lg:w-[30%]">
                        <ActionCard>
                            <Typography variant="h4" className="mb-6">
                                Penugasan Materi
                            </Typography>

                            <Link
                                href={buttonHref}
                                as="button"
                                className="w-full"
                            >
                                <PrimaryButton className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800">
                                    {buttonLabel}
                                </PrimaryButton>
                            </Link>
                        </ActionCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
