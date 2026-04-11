'use client';

import { TemplateName } from '@/types/resume';
import { TemplateProps } from './TemplateWrapper';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeTemplate from './CreativeTemplate';
import CompactTemplate from './CompactTemplate';
import TechTemplate from './TechTemplate';
import ElegantTemplate from './ElegantTemplate';
import BoldTemplate from './BoldTemplate';
import AcademicTemplate from './AcademicTemplate';
import CorporateTemplate from './CorporateTemplate';
import NordicTemplate from './NordicTemplate';
import GradientTemplate from './GradientTemplate';
import TimelineTemplate from './TimelineTemplate';
import SidebarTemplate from './SidebarTemplate';
import InfographicTemplate from './InfographicTemplate';
import FederalTemplate from './FederalTemplate';
import StartupTemplate from './StartupTemplate';
import MonochromeTemplate from './MonochromeTemplate';

const templateComponents: Record<TemplateName, React.ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimalist: MinimalistTemplate,
  professional: ProfessionalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  compact: CompactTemplate,
  tech: TechTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
  academic: AcademicTemplate,
  corporate: CorporateTemplate,
  nordic: NordicTemplate,
  gradient: GradientTemplate,
  timeline: TimelineTemplate,
  sidebar: SidebarTemplate,
  infographic: InfographicTemplate,
  federal: FederalTemplate,
  startup: StartupTemplate,
  monochrome: MonochromeTemplate,
};

export function getTemplateComponent(name: TemplateName) {
  return templateComponents[name];
}
