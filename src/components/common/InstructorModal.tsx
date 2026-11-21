import React from 'react';
import { Modal } from './Modal';
import { Instagram, Github, Mail, Phone, Heart, GraduationCap, ExternalLink, LucideIcon } from 'lucide-react';

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Channel {
  Icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const CHANNELS: Channel[] = [
  { Icon: Instagram, label: 'Instagram', value: 'siwak_.65', href: 'https://instagram.com/siwak_.65' },
  { Icon: Github, label: 'GitHub', value: 'Professor-Shin', href: 'https://github.com/Professor-Shin' },
  { Icon: Mail, label: 'Email', value: 'siwakorn7448@gmail.com' },
  { Icon: Phone, label: 'Phone', value: '+66 98-881-9281' },
];

export const InstructorModal: React.FC<InstructorModalProps> = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Instructor & TA credit"
    subtitle="Platform developer & content creator"
    icon={<GraduationCap className="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true" />}
    footer={
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-subtle text-muted hover:text-primary hover:border-strong text-xs font-medium transition-colors"
        >
          Close
        </button>
      </div>
    }
  >
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src="/assets/instructor-profile.png"
          alt="Siwakorn Saiphaisri"
          className="w-20 h-20 rounded-xl object-cover border border-subtle flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-base font-semibold text-primary">Siwakorn Shin Saiphaisri</h3>
            <span className="px-2 py-0.5 rounded-md border border-fill-line bg-fill-tint text-fill text-[11px] font-mono">
              Professor.Shin
            </span>
          </div>
          <p className="text-[11px] text-accent">
            Computer Programming (2301172 / 2301173) TA · Chulalongkorn University
          </p>
          <p className="text-xs text-muted leading-relaxed">
            “Hi everyone, I’m Shin. I’ve been a ComProg TA for 4–5 terms. I created this platform to
            help university students practice Python code comprehension, tracing, and logic
            prediction for midterm &amp; final exams!”
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[11px] font-medium uppercase tracking-wider text-faint">
          Contact &amp; social
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHANNELS.map(({ Icon, label, value, href }) => {
            const inner = (
              <>
                <Icon className="w-4 h-4 text-faint flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="text-[10px] text-faint block">{label}</span>
                  <span className="text-xs font-mono truncate block text-muted">{value}</span>
                </span>
                {href && (
                  <ExternalLink className="w-3 h-3 text-faint flex-shrink-0" aria-hidden="true" />
                )}
              </>
            );

            return href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-subtle hover:border-strong transition-colors"
              >
                {inner}
              </a>
            ) : (
              <div
                key={label}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-subtle"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-fill-line bg-fill-tint rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3.5">
        <img
          src="/assets/donation-qr.png"
          alt="PromptPay donation QR code"
          className="w-20 h-28 object-contain rounded-lg bg-white p-1 flex-shrink-0"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-fill font-medium text-xs">
            <Heart className="w-3.5 h-3.5" aria-hidden="true" />
            Support the platform
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Optional support goes toward hosting costs and treats handed out during ComProg review
            sessions.
          </p>
        </div>
      </div>
    </div>
  </Modal>
);
