"use client";
import React, { use, useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import { Sandpack } from "@codesandbox/sandpack-react";
import { notFound } from "next/navigation";

export default function SubdomainPreview(props: { params: Promise<{ subdomain: string }> }) {
    const params = use(props.params);
    const site = params.subdomain;

    const [project, setProject] = useState<any>(undefined);

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('subdomain', site)
                .single();

            if (error) {
                console.error("Error fetching project preview:", error);
                setProject(null);
            } else {
                setProject(data);
            }
        };

        fetchProject();
    }, [site]);

    if (project === undefined) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
            </div>
        );
    }

    if (project === null) {
        return notFound();
    }

    // 2. Process files to handle IMAGE_ASSET marker
    const processedFiles = Object.entries(project.files as Record<string, string>).reduce((acc: Record<string, string>, [path, content]) => {
        if (typeof content === "string" && content.startsWith("IMAGE_ASSET:")) {
            const imageUrl = content.replace("IMAGE_ASSET:", "");

            const cleanPath = path.split("/").pop() || "";
            const componentBase = cleanPath.replace(".png", "").replace(/[^a-zA-Z0-9]/g, "");
            const componentName = componentBase.charAt(0).toUpperCase() + componentBase.slice(1) + "Image";

            acc[`/src/components/${componentName}.tsx`] = `
import React from 'react';

export default function ${componentName}() {
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
      <img src="${imageUrl}" alt="Generated AI Asset" className="rounded-xl shadow-lg max-w-full h-auto border border-white/5" />
      <p className="text-[10px] text-gray-500 font-mono tracking-tighter opacity-50 uppercase">${cleanPath}</p>
    </div>
  );
}
`;
        } else {
            acc[path] = content;
        }
        return acc;
    }, {});

    return (
        <div className="h-screen w-screen bg-black overflow-hidden select-none">
            <Sandpack
                template="react"
                theme="dark"
                files={processedFiles}
                options={{
                    showNavigator: false,
                    showTabs: false,
                    showConsole: false,
                    externalResources: ["https://cdn.tailwindcss.com"],
                    classes: {
                        "sp-wrapper": "h-full w-full",
                        "sp-layout": "h-full w-full",
                        "sp-preview": "h-full w-full",
                    }
                }}
            />
        </div>
    );
}
