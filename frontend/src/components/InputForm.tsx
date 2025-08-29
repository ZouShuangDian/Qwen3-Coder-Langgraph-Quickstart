import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Zap, Cpu } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
}) => {
  const [internalInputValue, setInternalInputValue] = useState("");
  const [effort, setEffort] = useState("medium");
  const [model, setModel] = useState("Qwen2.5");

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    onSubmit(internalInputValue, effort, model);
    setInternalInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit with Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className={`flex flex-col gap-3 p-4 bg-white border-t border-gray-200`}
    >
      <div
        className={`flex flex-row items-end gap-2 rounded-xl ${
          hasHistory ? "rounded-br-xl" : ""
        } break-words min-h-12 bg-gray-50 border border-gray-300 px-3 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}
      >
        <Textarea
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className={`w-full text-gray-900 placeholder-gray-500 resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none bg-transparent
                        md:text-base min-h-[20px] max-h-[200px]`}
          rows={1}
        />
        <div className="pb-1">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
              onClick={onCancel}
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className={`${
                isSubmitDisabled
                  ? "text-gray-400"
                  : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              } p-2 rounded-full transition-all duration-200`}
              disabled={isSubmitDisabled}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-2">
          <div className="flex flex-row items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 transition-colors duration-200">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">Effort</span>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[90px] bg-transparent border-none cursor-pointer py-0 h-6 pl-2">
                <SelectValue placeholder="Effort" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 text-gray-700 rounded-lg shadow-lg">
                <SelectItem
                  value="low"
                  className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="high"
                  className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 transition-colors duration-200">
            <Cpu className="h-4 w-4" />
            <span className="text-sm font-medium">Model</span>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[140px] bg-transparent border-none cursor-pointer py-0 h-6 pl-2">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 text-gray-700 rounded-lg shadow-lg">
                <SelectItem
                  value="qwen-2.5"
                  className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" /> Qwen 2.5
                  </div>
                </SelectItem>
                <SelectItem
                  value="Qwen3-235B-A22B"
                  className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-orange-500" /> Qwen3-235B-A22B
                  </div>
                </SelectItem>
                <SelectItem
                  value="qwen-max"
                  className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2"
                >
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-purple-500" /> Qwen Max
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasHistory && (
          <Button
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-all duration-200 flex items-center gap-2"
            variant="default"
            onClick={() => window.location.reload()}
          >
            <SquarePen size={16} />
            <span className="text-sm font-medium">New Search</span>
          </Button>
        )}
      </div>
    </form>
  );
};
