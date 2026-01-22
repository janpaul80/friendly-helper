"use client";
import { WorkspaceEditor } from "@/components/workspace-v2/WorkspaceEditor";
import { use } from "react";

export default function Workspace(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const projectId = params?.id;

    return <WorkspaceEditor projectId={projectId} />;
}
