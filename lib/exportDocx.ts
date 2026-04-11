import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
  TabStopPosition,
  TabStopType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '@/types/resume';

function formatBullet(text: string): string {
  return text.replace(/^[•\-\*]\s*/, '');
}

function hexToRgb(hex: string): string {
  return hex.replace('#', '');
}

export async function downloadDocx(data: ResumeData, primaryColor: string) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;
  const color = hexToRgb(primaryColor);

  const children: Paragraph[] = [];

  // Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Your Name',
          bold: true,
          size: 48,
          color,
        }),
      ],
    })
  );

  // Job title
  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: personalInfo.jobTitle,
            size: 24,
            color: '666666',
          }),
        ],
      })
    );
  }

  // Contact line
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.website) contactParts.push(personalInfo.website);
  if (personalInfo.github) contactParts.push(personalInfo.github);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18,
            color: '888888',
          }),
        ],
      })
    );
  }

  // Section heading helper
  const addSectionHeading = (title: string) => {
    children.push(
      new Paragraph({
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            color,
          }),
        ],
      })
    );
  };

  // Summary
  if (summary) {
    addSectionHeading('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: summary, size: 22, color: '444444' }),
        ],
      })
    );
  }

  // Experience
  if (experience.length > 0) {
    addSectionHeading('Professional Experience');
    for (const exp of experience) {
      children.push(
        new Paragraph({
          spacing: { before: 120 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22 }),
            new TextRun({ text: '\t', size: 22 }),
            new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, size: 18, color: '666666' }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${exp.company}${exp.location ? `, ${exp.location}` : ''}`, italics: true, size: 20, color: '666666' }),
          ],
        })
      );
      for (const h of exp.highlights) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: formatBullet(h), size: 20, color: '444444' }),
            ],
          })
        );
      }
    }
  }

  // Education
  if (education.length > 0) {
    addSectionHeading('Education');
    for (const edu of education) {
      children.push(
        new Paragraph({
          spacing: { before: 120 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 22 }),
            new TextRun({ text: '\t', size: 22 }),
            new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 18, color: '666666' }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${edu.institution}${edu.location ? `, ${edu.location}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`, italics: true, size: 20, color: '666666' }),
          ],
        })
      );
      for (const h of edu.highlights) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: formatBullet(h), size: 20, color: '444444' }),
            ],
          })
        );
      }
    }
  }

  // Skills
  if (skills.length > 0) {
    addSectionHeading('Skills');
    for (const skill of skills) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: `${skill.category}: `, bold: true, size: 20 }),
            new TextRun({ text: skill.items.join(', '), size: 20, color: '555555' }),
          ],
        })
      );
    }
  }

  // Projects
  if (projects.length > 0) {
    addSectionHeading('Projects');
    for (const proj of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 120 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: proj.name, bold: true, size: 22 }),
            ...(proj.startDate ? [
              new TextRun({ text: '\t', size: 22 }),
              new TextRun({ text: `${proj.startDate}${proj.endDate ? ` - ${proj.endDate}` : ''}`, size: 18, color: '666666' }),
            ] : []),
          ],
        })
      );
      if (proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: proj.technologies.join(' | '), italics: true, size: 18, color: '888888' }),
            ],
          })
        );
      }
      for (const h of proj.highlights) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: formatBullet(h), size: 20, color: '444444' }),
            ],
          })
        );
      }
    }
  }

  // Certifications
  if (certifications.length > 0) {
    addSectionHeading('Certifications');
    for (const cert of certifications) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20 }),
            new TextRun({ text: ` — ${cert.issuer}`, size: 20, color: '666666' }),
            new TextRun({ text: '\t', size: 20 }),
            new TextRun({ text: cert.date, size: 18, color: '666666' }),
          ],
        })
      );
    }
  }

  // Languages
  if (languages.length > 0) {
    addSectionHeading('Languages');
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: languages.flatMap((lang, i) => [
          new TextRun({ text: lang.name, bold: true, size: 20 }),
          new TextRun({ text: lang.proficiency ? ` (${lang.proficiency})` : '', size: 20, color: '666666' }),
          ...(i < languages.length - 1 ? [new TextRun({ text: '    ', size: 20 })] : []),
        ]),
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.fullName || 'resume'}.docx`);
}
