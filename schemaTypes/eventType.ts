import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
        name: 'slug',
        type: 'slug',
        options: {source: 'name'},
        validation: (rule) => rule
          .required()
          .error(`Required to generate a page on the website`),
    }),
    defineField({
        name: 'venue',
        type: 'reference',
        to: [{type: 'venue'}],
        validation: (rule) =>
          rule.custom((value, context) => {
            if (value && context?.document?.eventType === 'virtual') {
              return 'Only in-person events can have a venue'
            }
      
            return true
          }),
    }),
    defineField({
      name: 'date',
      type: 'datetime',
    }),
    defineField({
        name: 'doorsOpen',
        description: 'Number of minutes before the start time for admission',
        type: 'number',
        initialValue: 60,
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tickets',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'No date'
  
      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})