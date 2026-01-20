"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { CogIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/ai-settings");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setSettings(data);
      } catch {
        toast.error("Failed to load AI settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ai-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
          <CogIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Core Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage global AI behavior and parameters
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Master Switch</h3>
            <p className="text-sm text-gray-500">Enable or disable AI features globally</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings({ ...settings, enabled: e.target.checked })
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Model Name</label>
            <select
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            >
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Max Tokens</label>
            <Input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Temperature (Creativity): {settings.temperature}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Precise (0.0)</span>
            <span>Balanced (0.5)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">System Prompt</label>
          <textarea
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            rows={5}
            value={settings.systemPrompt}
            onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
            placeholder="Define the AI's core personality and constraints..."
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
}
