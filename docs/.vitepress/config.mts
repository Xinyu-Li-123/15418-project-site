import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GpJSON",
  description: "Website for 15-418/15-618 Final Project",
  base: '/15418-project-site/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Proposal', link: '/proposal' },
      { text: 'Milestone', link: '/project-milestone-report' },
    ],

    // sidebar: [
    //   {
    //     text: 'Documents',
    //     items: [
    //       { text: 'Proposal', link: '/proposal' },
    //     ]
    //   }
    // ],
    //
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
