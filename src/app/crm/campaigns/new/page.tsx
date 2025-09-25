"use client";

import { useState } from "react";

export default function NewCampaign() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    if (scheduledAt) formData.append("scheduledAt", scheduledAt);
    if (media) formData.append("media", media);

    const res = await fetch("/api/campaigns", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Campaign created successfully!");
    } else {
      alert("Error creating campaign");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setMedia(e.target.files?.[0] || null)}
      />
      <button type="submit">Create Campaign</button>
    </form>
  );
}
