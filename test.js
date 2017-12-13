hello;

{{#each currentUser.childIds as |ponzvert| }}
  <!-- <tr> -->
    <!-- <td>
      40 points: <strong>{{ponzvert.displayName}} </strong> <em>ponzverted on {{ponzvert.createdAt}}</em>
    </td> -->
    {{>referral ponzvert=ponzvert}}
  <!-- </tr> -->
  <tr>
    <!-- <td>
      <span class="tab">20 points: <strong>{{ponzvert.displayName}} </strong> <em>ponzverted on {{ponzvert.createdAt}}</em></span>
    </td> -->
  </tr>
{{/each }}
